import { mapDatabaseLead } from '../cms';
import { validateAdminSession } from '../supabase/auth';

console.log('--- STARTING LEADS CRM MAPPING & AUTHENTICATION AUDIT TESTS ---');

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

async function runCrmTests() {
  // TEST 1: Map database record with primary columns (full_name, whatsapp_number, business_company, project_requirement)
  const prodRow1 = {
    id: 'lead-uuid-1',
    full_name: 'Devraj Patel',
    whatsapp_number: '+91 98765 11111',
    business_company: 'Patel Silks & Sarees',
    project_requirement: 'Need luxury e-commerce catalog with direct WhatsApp checkout.',
    email: 'devraj@patelsilks.in',
    service: 'Website Development',
    status: 'new',
    priority: 'high',
    created_at: '2026-10-10T10:00:00Z',
    updated_at: '2026-10-10T10:00:00Z',
  };

  const mapped1 = mapDatabaseLead(prodRow1);
  assert(mapped1.name === 'Devraj Patel', 'full_name mapped to name');
  assert(mapped1.phone === '+91 98765 11111', 'whatsapp_number mapped to phone');
  assert(mapped1.business_name === 'Patel Silks & Sarees', 'business_company mapped to business_name');
  assert(mapped1.requirement === 'Need luxury e-commerce catalog with direct WhatsApp checkout.', 'project_requirement mapped to requirement');
  assert(mapped1.email === 'devraj@patelsilks.in', 'email preserved');
  assert(mapped1.status === 'new', 'status normalized to new');
  assert(mapped1.priority === 'high', 'priority normalized to high');

  // TEST 2: Map database record with alternate columns (name, phone, business_name, requirement)
  const prodRow2 = {
    id: 'lead-uuid-2',
    name: 'Ananya Sen',
    phone: '+91 99887 22222',
    business_name: 'Sen Architecture Studio',
    requirement: 'Portfolio showcase with high-res editorial typography.',
    email: 'ananya@senarchitects.com',
    service: 'Branding & Identity',
    status: 'in_discussion',
    priority: 'urgent',
    remarks: 'Met on Google Meet. Sending proposal on Monday.',
    created_at: '2026-10-10T12:00:00Z',
  };

  const mapped2 = mapDatabaseLead(prodRow2);
  assert(mapped2.name === 'Ananya Sen', 'name preserved');
  assert(mapped2.phone === '+91 99887 22222', 'phone preserved');
  assert(mapped2.business_name === 'Sen Architecture Studio', 'business_name preserved');
  assert(mapped2.requirement === 'Portfolio showcase with high-res editorial typography.', 'requirement preserved');
  assert(mapped2.status === 'in_discussion', 'status preserved as in_discussion');
  assert(mapped2.priority === 'urgent', 'priority preserved as urgent');
  assert(mapped2.remarks === 'Met on Google Meet. Sending proposal on Monday.', 'remarks preserved');

  // TEST 3: Safe handling of missing optional fields
  const sparseRow = {
    id: 'lead-uuid-3',
    full_name: 'Rajesh Kumar',
    whatsapp_number: '+91 91234 56789',
    project_requirement: 'Need quick quote for landing page.',
    // email missing, business missing, service missing, status missing, priority missing
  };

  const mapped3 = mapDatabaseLead(sparseRow);
  assert(mapped3.name === 'Rajesh Kumar', 'Sparse lead has name');
  assert(mapped3.phone === '+91 91234 56789', 'Sparse lead has phone');
  assert(mapped3.business_name === null, 'Missing business defaults to null safely');
  assert(mapped3.email.includes('@whatsapp.client'), 'Missing email generates safe WhatsApp fallback');
  assert(mapped3.service === 'General Inquiry', 'Missing service defaults to General Inquiry');
  assert(mapped3.status === 'new', 'Missing status defaults to new');
  assert(mapped3.priority === 'normal', 'Missing priority defaults to normal');

  // TEST 4: Case insensitive and status normalization
  const messyRow = {
    id: 'lead-uuid-4',
    name: 'Kabir Verma',
    requirement: 'App UI design',
    status: 'CONTACTED',
    priority: 'URGENT',
  };
  const mapped4 = mapDatabaseLead(messyRow);
  assert(mapped4.status === 'contacted', 'Uppercase CONTACTED normalized to contacted');
  assert(mapped4.priority === 'urgent', 'Uppercase URGENT normalized to urgent');

  // TEST 5: Free Website Demo auto-assigns high priority if priority not specified
  const demoRow = {
    id: 'lead-uuid-5',
    name: 'Suhani Roy',
    phone: '+91 98000 00000',
    requirement: 'Free demo website for boutique hotel.',
    service: 'Free Website Demo',
  };
  const mapped5 = mapDatabaseLead(demoRow);
  assert(mapped5.priority === 'high', 'Free Website Demo automatically defaults to high priority');

  // TEST 6: Unauthenticated user check in validateAdminSession
  // In an unauthenticated state without session, it must return isAuthenticated: false
  if (typeof window !== 'undefined') {
    localStorage.removeItem('yugark_admin_session');
  }
  const authResult = await validateAdminSession();
  assert(authResult.isAuthenticated === false, 'Unauthenticated user correctly blocked by validateAdminSession');
  assert(authResult.isAdmin === false, 'Unauthenticated user has isAdmin = false');
  assert(typeof authResult.error === 'string', 'Helpful security error returned');

  console.log(`\n🎉 LEADS CRM TESTS COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED`);
  if (failedTests > 0) {
    process.exit(1);
  }
}

runCrmTests();
