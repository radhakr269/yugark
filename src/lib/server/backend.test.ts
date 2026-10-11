import {
  validateAndSanitizeLead,
  checkRateLimit,
  resetRateLimits,
  processLeadSubmission,
  getBackendHealth,
  MAX_REQUESTS_PER_WINDOW,
} from './leadService';

console.log('--- STARTING BACKEND SECURITY & INTEGRATION TESTS ---');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passedTests++;
    console.log(`✅ PASSED: ${message}`);
  } else {
    failedTests++;
    console.error(`❌ FAILED: ${message}`);
  }
}

async function runTests() {
  // 1. HEALTH CHECK TEST
  const health = getBackendHealth('Express + Vite Full-Stack');
  assert(health.status === 'ok', 'Health check returns status ok');
  assert(typeof health.timestamp === 'string', 'Health check returns ISO timestamp');
  assert(health.storageBucket === 'public-cms-media', 'Storage bucket configured as public-cms-media');

  // 2. VALIDATION: Valid submission with email & phone
  const validLead = {
    name: '  Vikramaditya Rao  ',
    email: '  vikram@studio.in  ',
    phone: '  +91 98765 43210  ',
    business_name: '  Rao Atelier  ',
    requirement: '  Complete digital brand design and website with WhatsApp integration.  ',
    service: 'Website Development',
    timeline: 'Standard (2–4 weeks)',
    page_source: 'website_contact',
  };
  const valResult1 = validateAndSanitizeLead(validLead);
  if (valResult1.isValid) {
    assert(true, 'Valid lead passes validation');
    assert(valResult1.lead.name === 'Vikramaditya Rao', 'Name trimmed properly');
    assert(valResult1.lead.email === 'vikram@studio.in', 'Email trimmed properly');
    assert(valResult1.lead.status === 'new', 'Lead status enforced as new');
    assert(valResult1.lead.priority === 'normal', 'Standard service gets normal priority');
  } else {
    assert(false, 'Valid lead failed validation unexpectedly');
  }

  // 3. VALIDATION: Free Website Demo gives high priority & phone-only fallback email
  const demoLead = {
    name: 'Priya Sharma',
    phone: '+919123456789',
    business_name: 'Priya Organic Skincare',
    requirement: 'Need a demo for organic cosmetic brand showcase.',
    service: 'Free Website Demo',
  };
  const valResult2 = validateAndSanitizeLead(demoLead);
  if (valResult2.isValid) {
    assert(true, 'Free Demo lead with phone only is valid');
    assert(valResult2.lead.priority === 'high', 'Free Website Demo assigned high priority');
    assert(valResult2.lead.email.includes('@whatsapp.demo'), 'Fallback demo email generated for phone-only lead');
  } else {
    assert(false, 'Demo lead failed validation unexpectedly');
  }

  // 4. VALIDATION: Rejects empty name
  const emptyNameLead = { ...validLead, name: '   ' };
  const resEmptyName = validateAndSanitizeLead(emptyNameLead);
  assert(!resEmptyName.isValid, 'Empty name correctly rejected');

  // 5. VALIDATION: Rejects empty contact channels
  const noContactLead = { ...validLead, email: '', phone: '' };
  const resNoContact = validateAndSanitizeLead(noContactLead);
  assert(!resNoContact.isValid, 'Submission with neither email nor phone rejected');

  // 6. VALIDATION: Rejects malformed email
  const badEmailLead = { ...validLead, email: 'not-an-email' };
  const resBadEmail = validateAndSanitizeLead(badEmailLead);
  assert(!resBadEmail.isValid, 'Invalid email format rejected');

  // 7. VALIDATION: Rejects empty requirements
  const emptyReqLead = { ...validLead, requirement: '   ' };
  const resEmptyReq = validateAndSanitizeLead(emptyReqLead);
  assert(!resEmptyReq.isValid, 'Empty requirement rejected');

  // 8. SECURITY: Honeypot trap
  const botSubmission = {
    ...validLead,
    website_honeypot: 'http://spam-link.com',
  };
  const resHoneypot = validateAndSanitizeLead(botSubmission);
  if (resHoneypot.isSpam) {
    assert(true, 'Honeypot trap catches bot submission');
    assert(resHoneypot.refId === 'YUG-SEC-OK', 'Honeypot returns silent acknowledgment code');
  } else {
    assert(false, 'Honeypot failed to catch bot submission');
  }

  // 9. SECURITY: Rate Limiting
  resetRateLimits();
  const testIp = '192.168.1.100';
  for (let i = 0; i < MAX_REQUESTS_PER_WINDOW; i++) {
    const limited = checkRateLimit(testIp);
    assert(!limited, `Request ${i + 1} within rate limit`);
  }
  const exceedsLimit = checkRateLimit(testIp);
  assert(exceedsLimit === true, '6th request triggers rate limiter (429)');
  resetRateLimits();

  // 10. PIPELINE: Bot submission handled through processLeadSubmission
  const botPipelineResult = await processLeadSubmission(botSubmission, '10.0.0.1');
  assert(botPipelineResult.status === 200, 'Honeypot submission returns 200 to bot');
  assert(botPipelineResult.body.refId === 'YUG-SEC-OK', 'Honeypot body contains YUG-SEC-OK');

  // 11. PIPELINE: Valid submission through processLeadSubmission
  const validPipelineResult = await processLeadSubmission(validLead, '10.0.0.2');
  assert(validPipelineResult.status === 200, 'Valid submission returns status 200');
  assert(validPipelineResult.body.success === true, 'Valid submission body success is true');
  assert(typeof validPipelineResult.body.refId === 'string', 'Valid submission returns reference ID');
  assert(Boolean(validPipelineResult.body.refId?.startsWith('YUG-')), 'Reference ID has YUG- prefix');

  // 12. LENGTH SANITIZATION: Truncates oversized input gracefully without crashing
  const hugeLead = {
    name: 'A'.repeat(500),
    email: 'valid@studio.com',
    phone: '1234567890',
    requirement: 'B'.repeat(10000),
  };
  const valHuge = validateAndSanitizeLead(hugeLead);
  if (valHuge.isValid) {
    assert(true, 'Huge payload is validated and sanitized');
    assert(valHuge.lead.name.length <= 150, 'Name truncated to 150 chars max');
    assert(valHuge.lead.requirement.length <= 3000, 'Requirement truncated to 3000 chars max');
  } else {
    assert(false, 'Huge payload validation failed');
  }

  console.log(`\n🎉 RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
