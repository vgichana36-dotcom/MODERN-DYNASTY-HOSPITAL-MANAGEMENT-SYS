// ======================
// ENHANCED STATE MANAGEMENT
// ======================
let currentUser = null;
let users = [];
let patients = [];
let appointments = [];
let medicalRecords = [];
let labResults = [];
let medications = [];
let billingRecords = [];
let roleChangeLogs = [];
let currentTestimonialSlide = 0;
let selectedPaymentMethod = '';
let currentBillBeingPaid = null;
let currentEditRecord = null;
let currentViewRecord = null;
let pendingConfirmation = null;
let currentQuickAction = null;

// Pagination variables
let currentPage = {
    patients: 1,
    appointments: 1,
    users: 1,
    medical: 1,
    lab: 1,
    medications: 1,
    billing: 1
};

const itemsPerPage = 10;

// ======================
// FIREBASE CONFIGURATION
// ======================
const firebaseConfig = {
    apiKey: "AIzaSyDt3QyqUFhMKtN9b-BmnqsSSx4zQCJ8klc",
    authDomain: "modern-dynasty-hospital-11d8f.firebaseapp.com",
    projectId: "modern-dynasty-hospital-11d8f",
    storageBucket: "modern-dynasty-hospital-11d8f.firebasestorage.app",
    messagingSenderId: "421964475287",
    appId: "1:421964475287:web:d8ef3e56a287391fbdb2d2",
    measurementId: "G-7X4SZN3SEZ"
};

// Firebase variables
let db = null;
let auth = null;
let firebaseInitialized = false;

// ======================
// ENHANCED DEMO DATA WITH KENYAN CONTEXT
// ======================
const generateDemoData = () => {
    const demoUsers = [
        {
            id: "1",
            firstName: "Admin",
            lastName: "User",
            email: "admin@moderndynasty.com",
            password: "admin123",
            role: "admin",
            status: "active",
            requestedRole: null,
            approvedBy: null,
            approvedAt: new Date().toISOString(),
            lastRoleChange: {
                date: new Date().toISOString(),
                changedBy: "system",
                fromRole: null,
                toRole: "admin"
            },
            suspensionReason: null,
            assignedPatients: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        },
        {
            id: "2",
            firstName: "John",
            lastName: "Kamau",
            email: "doctor@hospital.com",
            password: "doctor123",
            role: "doctor",
            status: "active",
            requestedRole: null,
            approvedBy: "1",
            approvedAt: new Date().toISOString(),
            lastRoleChange: {
                date: new Date().toISOString(),
                changedBy: "1",
                fromRole: "pending_approval",
                toRole: "doctor"
            },
            suspensionReason: null,
            assignedPatients: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            specialty: "Cardiology",
            licenseNumber: "KMPDB-12345",
            department: "Cardiology Department"
        },
        {
            id: "3",
            firstName: "Sarah",
            lastName: "Wanjiku",
            email: "nurse@hospital.com",
            password: "nurse123",
            role: "nurse",
            status: "active",
            requestedRole: null,
            approvedBy: "1",
            approvedAt: new Date().toISOString(),
            lastRoleChange: {
                date: new Date().toISOString(),
                changedBy: "1",
                fromRole: "pending_approval",
                toRole: "nurse"
            },
            suspensionReason: null,
            assignedPatients: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            licenseNumber: "NCN-67890",
            department: "Emergency Department"
        },
        {
            id: "4",
            firstName: "Mike",
            lastName: "Ochieng",
            email: "staff@hospital.com",
            password: "staff123",
            role: "staff",
            status: "active",
            requestedRole: null,
            approvedBy: "1",
            approvedAt: new Date().toISOString(),
            lastRoleChange: {
                date: new Date().toISOString(),
                changedBy: "1",
                fromRole: "pending_approval",
                toRole: "staff"
            },
            suspensionReason: null,
            assignedPatients: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            department: "Administration"
        },
        {
            id: "5",
            firstName: "Emily",
            lastName: "Akinyi",
            email: "patient@hospital.com",
            password: "patient123",
            role: "patient",
            status: "active",
            requestedRole: null,
            approvedBy: null,
            approvedAt: new Date().toISOString(),
            lastRoleChange: null,
            suspensionReason: null,
            assignedPatients: [],
            patientId: "P1001",
            nationalId: "12345678",
            phoneNumber: "+254712345678",
            address: "123 Nairobi Street, Nairobi",
            dateOfBirth: "1985-05-15",
            bloodGroup: "O+",
            insuranceProvider: "NHIF",
            insuranceNumber: "NHIF-12345",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        },
        {
            id: "6",
            firstName: "Robert",
            lastName: "Mwangi",
            email: "robert.m@hospital.com",
            password: "doctor123",
            role: "pending_approval",
            status: "pending",
            requestedRole: "doctor",
            approvedBy: null,
            approvedAt: null,
            lastRoleChange: null,
            suspensionReason: null,
            assignedPatients: [],
            createdAt: new Date().toISOString()
        }
    ];

    const demoPatientData = [
        {
            id: "P1001",
            userId: "5",
            firstName: "Emily",
            lastName: "Akinyi",
            email: "patient@hospital.com",
            phoneNumber: "+254712345678",
            nationalId: "12345678",
            dateOfBirth: "1985-05-15",
            gender: "female",
            bloodGroup: "O+",
            address: "123 Nairobi Street, Nairobi",
            emergencyContact: {
                name: "John Akinyi",
                relationship: "Husband",
                phone: "+254723456789"
            },
            insuranceProvider: "NHIF",
            insuranceNumber: "NHIF-12345",
            primaryCarePhysician: "2",
            allergies: ["Penicillin", "Sulfa drugs"],
            chronicConditions: ["Hypertension"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            status: "active"
        },
        {
            id: "P1002",
            userId: null,
            firstName: "David",
            lastName: "Omondi",
            email: "david.omondi@email.com",
            phoneNumber: "+254712345679",
            nationalId: "87654321",
            dateOfBirth: "1978-11-22",
            gender: "male",
            bloodGroup: "A+",
            address: "456 Mombasa Road, Nairobi",
            emergencyContact: {
                name: "Mary Omondi",
                relationship: "Wife",
                phone: "+254723456790"
            },
            insuranceProvider: "AAR Healthcare",
            insuranceNumber: "AAR-54321",
            primaryCarePhysician: "2",
            allergies: ["None"],
            chronicConditions: ["Diabetes Type 2"],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active"
        },
        {
            id: "P1003",
            userId: null,
            firstName: "Grace",
            lastName: "Wambui",
            email: "grace.w@email.com",
            phoneNumber: "+254712345680",
            nationalId: "23456789",
            dateOfBirth: "1990-03-10",
            gender: "female",
            bloodGroup: "B+",
            address: "789 Thika Road, Kiambu",
            emergencyContact: {
                name: "James Wambui",
                relationship: "Brother",
                phone: "+254723456791"
            },
            insuranceProvider: "Jubilee Insurance",
            insuranceNumber: "JUB-98765",
            primaryCarePhysician: "2",
            allergies: ["Peanuts"],
            chronicConditions: ["Asthma"],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active"
        }
    ];

    const demoAppointments = [
        {
            id: "A1001",
            patientId: "P1001",
            patientUserId: "5",
            doctorId: "2",
            doctorName: "Dr. John Kamau",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: "10:00",
            type: "checkup",
            reason: "Routine checkup and blood pressure monitoring",
            status: "scheduled",
            duration: 30,
            location: "Consultation Room 3",
            notes: "Patient has history of hypertension",
            createdBy: "5",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: "A1002",
            patientId: "P1002",
            patientUserId: null,
            doctorId: "2",
            doctorName: "Dr. John Kamau",
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: "14:30",
            type: "consultation",
            reason: "Diabetes management review",
            status: "scheduled",
            duration: 45,
            location: "Consultation Room 2",
            notes: "Review blood sugar levels",
            createdBy: "4",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    const demoMedicalRecords = [
        {
            id: "MR1001",
            patientId: "P1001",
            patientUserId: "5",
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            type: "progress",
            title: "Hypertension Follow-up",
            details: "Patient reports feeling well. Blood pressure readings show improvement with current medication. Continue with current treatment plan.",
            doctorId: "2",
            doctorName: "Dr. John Kamau",
            vitalSigns: {
                bloodPressure: "130/85",
                heartRate: "72",
                temperature: "36.8",
                weight: "65"
            },
            diagnosis: "Controlled hypertension",
            treatment: "Continue Lisinopril 10mg daily",
            followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdBy: "2",
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    const demoLabResults = [
        {
            id: "LR1001",
            patientId: "P1001",
            patientUserId: "5",
            testType: "blood",
            testName: "Complete Blood Count",
            testDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            result: "All parameters within normal range. Hemoglobin: 13.5 g/dL, WBC: 7.2 x10^9/L, Platelets: 250 x10^9/L.",
            notes: "Normal results, no abnormalities detected.",
            status: "completed",
            reviewedBy: "2",
            uploadedBy: "3",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    const demoMedications = [
        {
            id: "M1001",
            patientId: "P1001",
            patientUserId: "5",
            medicationName: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "Ongoing",
            instructions: "Take in the morning with food",
            prescribedBy: "2",
            prescribedByName: "Dr. John Kamau",
            prescribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: "active",
            refills: 3,
            pharmacy: "Hospital Pharmacy",
            notes: "For hypertension control",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    const demoBillingRecords = [
        {
            id: "B1001",
            patientId: "P1001",
            patientUserId: "5",
            invoiceNumber: "INV-2024-00123",
            billingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: "Consultation and Blood Tests",
            items: [
                { description: "Doctor Consultation", quantity: 1, unitPrice: 1500, amount: 1500 },
                { description: "Complete Blood Count", quantity: 1, unitPrice: 800, amount: 800 },
                { description: "Urinalysis", quantity: 1, unitPrice: 500, amount: 500 }
            ],
            subtotal: 2800,
            tax: 140,
            total: 2940,
            currency: "KES",
            status: "unpaid",
            paymentMethod: "",
            transactionId: "",
            paidAt: null,
            createdBy: "4",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "B1002",
            patientId: "P1002",
            patientUserId: null,
            invoiceNumber: "INV-2024-00098",
            billingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            description: "Consultation and Medication",
            items: [
                { description: "Doctor Consultation", quantity: 1, unitPrice: 1500, amount: 1500 },
                { description: "Metformin 500mg (30 tablets)", quantity: 1, unitPrice: 450, amount: 450 }
            ],
            subtotal: 1950,
            tax: 97.5,
            total: 2047.5,
            currency: "KES",
            status: "unpaid",
            paymentMethod: "",
            transactionId: "",
            paidAt: null,
            createdBy: "4",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    const demoRoleChangeLogs = [
        {
            id: "1",
            userId: "2",
            changedBy: "1",
            fromRole: "pending_approval",
            toRole: "doctor",
            timestamp: new Date().toISOString(),
            reason: "Initial approval after registration",
            adminName: "Admin User"
        }
    ];

    return {
        users: demoUsers,
        patients: demoPatientData,
        appointments: demoAppointments,
        medicalRecords: demoMedicalRecords,
        labResults: demoLabResults,
        medications: demoMedications,
        billingRecords: demoBillingRecords,
        roleChangeLogs: demoRoleChangeLogs
    };
};

// ======================
// ENHANCED ROLE-BASED PERMISSIONS
// ======================
const rolePermissions = {
    admin: {
        canViewAllPatients: true,
        canAddPatients: true,
        canEditMedicalRecords: true,
        canScheduleAppointments: true,
        canViewLabResults: true,
        canPrescribeMedications: true,
        canAccessBilling: true,
        canDeleteRecords: true,
        canManageUsers: true,
        canExportData: true,
        canAuditLogs: true,
        tabs: [
            { id: 'patients', name: 'Patient Records', icon: 'fa-user-injured' },
            { id: 'appointments', name: 'Appointments', icon: 'fa-calendar-alt' },
            { id: 'medical', name: 'Medical Records', icon: 'fa-file-medical-alt' },
            { id: 'lab', name: 'Lab Results', icon: 'fa-flask' },
            { id: 'medications', name: 'Medications', icon: 'fa-pills' },
            { id: 'billing', name: 'Billing', icon: 'fa-file-invoice-dollar' },
            { id: 'users', name: 'User Management', icon: 'fa-users-cog' },
            { id: 'reports', name: 'Reports', icon: 'fa-chart-bar' }
        ],
        quickActions: [
            { id: 'add-patient', name: 'Add Patient', icon: 'fa-user-plus', color: 'primary' },
            { id: 'schedule-appointment', name: 'Schedule Appointment', icon: 'fa-calendar-plus', color: 'secondary' },
            { id: 'create-invoice', name: 'Create Invoice', icon: 'fa-file-invoice', color: 'success' },
            { id: 'view-reports', name: 'View Reports', icon: 'fa-chart-line', color: 'warning' }
        ]
    },
    doctor: {
        canViewAllPatients: false,
        canAddPatients: true,
        canEditMedicalRecords: true,
        canScheduleAppointments: true,
        canViewLabResults: true,
        canPrescribeMedications: true,
        canAccessBilling: false,
        canDeleteRecords: false,
        canManageUsers: false,
        canExportData: true,
        canAuditLogs: false,
        tabs: [
            { id: 'patients', name: 'My Patients', icon: 'fa-user-injured' },
            { id: 'appointments', name: 'Appointments', icon: 'fa-calendar-alt' },
            { id: 'medical', name: 'Medical Records', icon: 'fa-file-medical-alt' },
            { id: 'lab', name: 'Lab Results', icon: 'fa-flask' },
            { id: 'medications', name: 'Prescribe', icon: 'fa-pills' },
            { id: 'reports', name: 'Clinical Reports', icon: 'fa-chart-bar' }
        ],
        quickActions: [
            { id: 'add-patient', name: 'Add Patient', icon: 'fa-user-plus', color: 'primary' },
            { id: 'schedule-appointment', name: 'Schedule Appointment', icon: 'fa-calendar-plus', color: 'secondary' },
            { id: 'prescribe-medication', name: 'Prescribe Medication', icon: 'fa-prescription', color: 'success' },
            { id: 'add-medical-record', name: 'Add Medical Record', icon: 'fa-file-medical', color: 'warning' }
        ]
    },
    nurse: {
        canViewAllPatients: false,
        canAddPatients: false,
        canEditMedicalRecords: true,
        canScheduleAppointments: true,
        canViewLabResults: true,
        canPrescribeMedications: false,
        canAccessBilling: false,
        canDeleteRecords: false,
        canManageUsers: false,
        canExportData: false,
        canAuditLogs: false,
        tabs: [
            { id: 'patients', name: 'My Patients', icon: 'fa-user-injured' },
            { id: 'appointments', name: 'Schedule', icon: 'fa-calendar-alt' },
            { id: 'medical', name: 'Nursing Notes', icon: 'fa-file-medical-alt' },
            { id: 'lab', name: 'Lab Results', icon: 'fa-flask' }
        ],
        quickActions: [
            { id: 'schedule-appointment', name: 'Schedule Appointment', icon: 'fa-calendar-plus', color: 'primary' },
            { id: 'add-lab-result', name: 'Add Lab Result', icon: 'fa-flask', color: 'secondary' },
            { id: 'add-nursing-note', name: 'Add Nursing Note', icon: 'fa-file-medical', color: 'success' },
            { id: 'view-vitals', name: 'View Vitals', icon: 'fa-heartbeat', color: 'warning' }
        ]
    },
    staff: {
        canViewAllPatients: false,
        canAddPatients: true,
        canEditMedicalRecords: false,
        canScheduleAppointments: true,
        canViewLabResults: false,
        canPrescribeMedications: false,
        canAccessBilling: true,
        canDeleteRecords: false,
        canManageUsers: false,
        canExportData: false,
        canAuditLogs: false,
        tabs: [
            { id: 'patients', name: 'Patient Registration', icon: 'fa-user-plus' },
            { id: 'appointments', name: 'Scheduling', icon: 'fa-calendar-alt' },
            { id: 'billing', name: 'Billing', icon: 'fa-file-invoice-dollar' }
        ],
        quickActions: [
            { id: 'add-patient', name: 'Register Patient', icon: 'fa-user-plus', color: 'primary' },
            { id: 'schedule-appointment', name: 'Schedule Appointment', icon: 'fa-calendar-plus', color: 'secondary' },
            { id: 'create-invoice', name: 'Create Invoice', icon: 'fa-file-invoice', color: 'success' },
            { id: 'process-payment', name: 'Process Payment', icon: 'fa-credit-card', color: 'warning' }
        ]
    },
    patient: {
        canViewAllPatients: false,
        canAddPatients: false,
        canEditMedicalRecords: false,
        canScheduleAppointments: true,
        canViewLabResults: true,
        canPrescribeMedications: false,
        canAccessBilling: true,
        canDeleteRecords: false,
        canManageUsers: false,
        canExportData: false,
        canAuditLogs: false,
        tabs: [
            { id: 'my-records', name: 'My Records', icon: 'fa-file-medical' },
            { id: 'appointments', name: 'My Appointments', icon: 'fa-calendar-alt' },
            { id: 'lab', name: 'My Lab Results', icon: 'fa-flask' },
            { id: 'medications', name: 'My Medications', icon: 'fa-pills' },
            { id: 'billing', name: 'My Bills', icon: 'fa-file-invoice-dollar' }
        ],
        quickActions: [
            { id: 'schedule-appointment', name: 'Schedule Appointment', icon: 'fa-calendar-plus', color: 'primary' },
            { id: 'view-medical-records', name: 'View Medical Records', icon: 'fa-file-medical', color: 'secondary' },
            { id: 'pay-bills', name: 'Pay Bills', icon: 'fa-credit-card', color: 'success' },
            { id: 'view-prescriptions', name: 'View Prescriptions', icon: 'fa-prescription', color: 'warning' }
        ]
    },
    pending_approval: {
        canViewAllPatients: false,
        canAddPatients: false,
        canEditMedicalRecords: false,
        canScheduleAppointments: false,
        canViewLabResults: false,
        canPrescribeMedications: false,
        canAccessBilling: false,
        canDeleteRecords: false,
        canManageUsers: false,
        canExportData: false,
        canAuditLogs: false,
        tabs: [],
        quickActions: []
    }
};

// ======================
// ENHANCED PATIENT SELECTION SYSTEM
// ======================

// Get patients for current user based on role
function getPatientsForUser() {
    let availablePatients = [];
    
    if (currentUser.role === 'patient') {
        // Patient can only see their own record
        const patientRecord = patients.find(p => p.userId === currentUser.id);
        if (patientRecord) {
            availablePatients = [patientRecord];
        }
    } else if (currentUser.role === 'doctor') {
        // Doctors see all active patients
        availablePatients = patients.filter(p => p.status === 'active');
    } else if (currentUser.role === 'nurse') {
        // Nurses see all active patients
        availablePatients = patients.filter(p => p.status === 'active');
    } else if (currentUser.role === 'staff') {
        // Staff see all patients for registration/billing
        availablePatients = patients;
    } else if (currentUser.role === 'admin') {
        // Admin sees all patients
        availablePatients = patients;
    }
    
    return availablePatients;
}

// Generate patient dropdown HTML
function generatePatientDropdown(selectedId = '', includeEmpty = true, id = 'patientSelect', showAllOption = false) {
    const availablePatients = getPatientsForUser();
    
    let options = '';
    
    if (includeEmpty) {
        options = `<option value="">${showAllOption ? 'All Patients' : 'Select a patient'}</option>`;
    }
    
    if (availablePatients.length === 0) {
        options += '<option value="" disabled>No patients available</option>';
    } else {
        availablePatients.forEach(patient => {
            const selected = patient.id === selectedId ? 'selected' : '';
            options += `<option value="${patient.id}" ${selected}>
                ${patient.firstName} ${patient.lastName} (${patient.id})
            </option>`;
        });
    }
    
    return `
        <div class="patient-select-container">
            <label for="${id}"><i class="fas fa-user-injured"></i> Select Patient</label>
            <div class="patient-select-wrapper">
                <select class="patient-select" id="${id}" name="${id}">
                    ${options}
                </select>
            </div>
            <div class="patient-select-info">
                ${availablePatients.length} patient(s) available
            </div>
        </div>
    `;
}

// Generate patient dropdown for specific patient IDs
function generatePatientDropdownForIds(patientIds = [], selectedId = '', id = 'patientSelect') {
    const availablePatients = patients.filter(p => 
        patientIds.includes(p.id) || patientIds.length === 0
    );
    
    let options = '<option value="">Select a patient</option>';
    
    availablePatients.forEach(patient => {
        const selected = patient.id === selectedId ? 'selected' : '';
        options += `<option value="${patient.id}" ${selected}>
            ${patient.firstName} ${patient.lastName} (${patient.id})
        </option>`;
    });
    
    return `
        <div class="patient-select-container">
            <label for="${id}"><i class="fas fa-user-injured"></i> Select Patient</label>
            <select class="patient-select" id="${id}" name="${id}">
                ${options}
            </select>
        </div>
    `;
}

// ======================
// ENHANCED DATA MANAGEMENT
// ======================
// ======================
// FIXED DATA MANAGER
// ======================
class DataManager {
    constructor() {
        this.loadData();
    }

    loadData() {
        console.log("📥 Loading data from localStorage...");
        
        try {
            const demoData = generateDemoData();
            
            // Load from localStorage or use demo data
            const savedUsers = localStorage.getItem('mdhms_users');
            const savedPatients = localStorage.getItem('mdhms_patients');
            const savedAppointments = localStorage.getItem('mdhms_appointments');
            const savedMedicalRecords = localStorage.getItem('mdhms_medicalRecords');
            const savedLabResults = localStorage.getItem('mdhms_labResults');
            const savedMedications = localStorage.getItem('mdhms_medications');
            const savedBilling = localStorage.getItem('mdhms_billing');
            const savedRoleLogs = localStorage.getItem('mdhms_role_change_logs');
            
            // Parse with fallback to demo data
            users = savedUsers ? JSON.parse(savedUsers) : demoData.users;
            patients = savedPatients ? JSON.parse(savedPatients) : demoData.patients;
            appointments = savedAppointments ? JSON.parse(savedAppointments) : demoData.appointments;
            medicalRecords = savedMedicalRecords ? JSON.parse(savedMedicalRecords) : demoData.medicalRecords;
            labResults = savedLabResults ? JSON.parse(savedLabResults) : demoData.labResults;
            medications = savedMedications ? JSON.parse(savedMedications) : demoData.medications;
            billingRecords = savedBilling ? JSON.parse(savedBilling) : demoData.billingRecords;
            roleChangeLogs = savedRoleLogs ? JSON.parse(savedRoleLogs) : demoData.roleChangeLogs;
            
            console.log(`✅ Loaded: ${users.length} users, ${patients.length} patients`);
            
        } catch (error) {
            console.error("❌ Error loading data:", error);
            const demoData = generateDemoData();
            users = demoData.users;
            patients = demoData.patients;
            appointments = demoData.appointments;
            medicalRecords = demoData.medicalRecords;
            labResults = demoData.labResults;
            medications = demoData.medications;
            billingRecords = demoData.billingRecords;
            roleChangeLogs = demoData.roleChangeLogs;
        }
    }

    saveData() {
        try {
            localStorage.setItem('mdhms_users', JSON.stringify(users));
            localStorage.setItem('mdhms_patients', JSON.stringify(patients));
            localStorage.setItem('mdhms_appointments', JSON.stringify(appointments));
            localStorage.setItem('mdhms_medicalRecords', JSON.stringify(medicalRecords));
            localStorage.setItem('mdhms_labResults', JSON.stringify(labResults));
            localStorage.setItem('mdhms_medications', JSON.stringify(medications));
            localStorage.setItem('mdhms_billing', JSON.stringify(billingRecords));
            localStorage.setItem('mdhms_role_change_logs', JSON.stringify(roleChangeLogs));
            
            console.log("✅ Data saved to localStorage");
            return true;
        } catch (error) {
            console.error("❌ Error saving data:", error);
            return false;
        }
    }

    async saveToFirebase(collectionName, data) {
        // If Firebase not initialized, save to localStorage
        if (!firebaseInitialized || !db) {
            return this.saveToLocalStorage(collectionName, data);
        }
        
        try {
            const dataToSave = {
                ...data,
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const docRef = await db.collection(collectionName).add(dataToSave);
            const docId = docRef.id;
            
            // Update local array
            this.updateLocalArray(collectionName, { id: docId, ...dataToSave });
            
            return { success: true, id: docId };
        } catch (error) {
            console.error(`Firebase save failed (${collectionName}):`, error);
            return this.saveToLocalStorage(collectionName, data);
        }
    }

    saveToLocalStorage(collectionName, data) {
        try {
            const newItem = {
                id: data.id || this.generateId(collectionName),
                ...data,
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.updateLocalArray(collectionName, newItem);
            this.saveData();
            
            return { success: true, id: newItem.id };
        } catch (error) {
            console.error(`LocalStorage save failed (${collectionName}):`, error);
            return { success: false, error: error.message };
        }
    }

    generateId(collectionName) {
        const prefix = {
            'users': 'USR',
            'patients': 'PAT',
            'appointments': 'APT',
            'medicalRecords': 'MR',
            'labResults': 'LR',
            'medications': 'MED',
            'billing': 'BILL'
        }[collectionName] || 'ID';
        
        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    updateLocalArray(collectionName, data) {
        const collectionMap = {
            'users': users,
            'patients': patients,
            'appointments': appointments,
            'medicalRecords': medicalRecords,
            'labResults': labResults,
            'medications': medications,
            'billing': billingRecords,
            'role_change_logs': roleChangeLogs
        };

        const collection = collectionMap[collectionName];
        if (collection) {
            const index = collection.findIndex(item => item.id === data.id);
            if (index !== -1) {
                collection[index] = data;
            } else {
                collection.push(data);
            }
        }
    }

    async updateRecord(collectionName, docId, data) {
        // If Firebase not initialized, update localStorage
        if (!firebaseInitialized || !db) {
            return this.updateLocalRecord(collectionName, docId, data);
        }
        
        try {
            const dataToUpdate = {
                ...data,
                updatedAt: new Date().toISOString()
            };
            
            await db.collection(collectionName).doc(docId).update(dataToUpdate);
            
            // Update local array
            const collection = this.getCollection(collectionName);
            const index = collection.findIndex(item => item.id === docId);
            if (index !== -1) {
                collection[index] = { ...collection[index], ...dataToUpdate };
            }
            
            this.saveData();
            
            return { success: true };
        } catch (error) {
            console.error(`Firebase update failed (${collectionName}):`, error);
            return this.updateLocalRecord(collectionName, docId, data);
        }
    }

    updateLocalRecord(collectionName, docId, data) {
        try {
            const collection = this.getCollection(collectionName);
            const index = collection.findIndex(item => item.id === docId);
            
            if (index !== -1) {
                collection[index] = {
                    ...collection[index],
                    ...data,
                    updatedAt: new Date().toISOString()
                };
                
                this.saveData();
                return { success: true };
            } else {
                return { success: false, error: "Record not found" };
            }
        } catch (error) {
            console.error(`LocalStorage update failed (${collectionName}):`, error);
            return { success: false, error: error.message };
        }
    }

    getCollection(collectionName) {
        const collectionMap = {
            'users': users,
            'patients': patients,
            'appointments': appointments,
            'medicalRecords': medicalRecords,
            'labResults': labResults,
            'medications': medications,
            'billing': billingRecords,
            'role_change_logs': roleChangeLogs
        };
        return collectionMap[collectionName];
    }

    // ... rest of the DataManager methods remain the same ...
}

// ======================
// INITIALIZE DATA MANAGER
// ======================
let dataManager = null;

// ======================
// DOM ELEMENTS
// ======================
const authBtn = document.getElementById('authBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const userInfo = document.getElementById('userInfo');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userRoleBadge = document.getElementById('userRoleBadge');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelector('.nav-links');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const dashboardSection = document.getElementById('dashboard');
const dashboardTitle = document.getElementById('dashboardTitle');
const dashboardSubtitle = document.getElementById('dashboardSubtitle');
const dashboardTabs = document.getElementById('dashboardTabs');
const dashboardContent = document.getElementById('dashboardContent');
const welcomeUserName = document.getElementById('welcomeUserName');
const welcomeUserRole = document.getElementById('welcomeUserRole');
const dashboardNav = document.querySelector('.dashboard-nav');
const authModalTitle = document.getElementById('authModalTitle');
const authModalSubtitle = document.getElementById('authModalSubtitle');
const getStartedBtn = document.querySelector('.get-started-btn');
const getStartedCta = document.querySelector('.get-started-cta');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const testimonialTrack = document.querySelector('.testimonial-track');
const tabBtns = document.querySelectorAll('.tab-btn');
const featureContents = document.querySelectorAll('.feature-content');
const userRoleSelect = document.getElementById('userRole');
const roleInfoPatient = document.getElementById('roleInfoPatient');
const roleInfoProfessional = document.getElementById('roleInfoProfessional');
const pendingApprovalScreen = document.getElementById('pendingApprovalScreen');
const regularDashboard = document.getElementById('regularDashboard');
const quickActionsBar = document.getElementById('quickActionsBar');
const quickActionsButtons = document.getElementById('quickActionsButtons');

// Modal elements
const confirmationModal = document.getElementById('confirmationModal');
const confirmationTitle = document.getElementById('confirmationTitle');
const confirmationMessage = document.getElementById('confirmationMessage');
const cancelConfirm = document.getElementById('cancelConfirm');
const confirmAction = document.getElementById('confirmAction');

const editModal = document.getElementById('editModal');
const editModalTitle = document.getElementById('editModalTitle');
const editModalSubtitle = document.getElementById('editModalSubtitle');
const editForm = document.getElementById('editForm');
const cancelEdit = document.getElementById('cancelEdit');

const viewModal = document.getElementById('viewModal');
const viewModalTitle = document.getElementById('viewModalTitle');
const viewModalSubtitle = document.getElementById('viewModalSubtitle');
const viewModalBody = document.getElementById('viewModalBody');
const closeViewModal = document.getElementById('closeViewModal');
const editFromView = document.getElementById('editFromView');

const paymentModal = document.getElementById('paymentModal');
const paymentModalTitle = document.getElementById('paymentModalTitle');
const paymentModalSubtitle = document.getElementById('paymentModalSubtitle');
const paymentContent = document.getElementById('paymentContent');
const cancelPayment = document.getElementById('cancelPayment');
const processPayment = document.getElementById('processPayment');

const receiptModal = document.getElementById('receiptModal');
const receiptContent = document.getElementById('receiptContent');
const closeReceipt = document.getElementById('closeReceipt');
const printReceipt = document.getElementById('printReceipt');

const quickActionModal = document.getElementById('quickActionModal');
const quickActionTitle = document.getElementById('quickActionTitle');
const quickActionContent = document.getElementById('quickActionContent');
const cancelQuickAction = document.getElementById('cancelQuickAction');
const executeQuickAction = document.getElementById('executeQuickAction');

// ======================
// ENHANCED FIREBASE INITIALIZATION
// ======================
async function initializeFirebase() {
    try {
        console.log("🚀 Initializing Firebase...");
        
        if (typeof firebase === 'undefined') {
            console.warn("Firebase SDK not loaded, using localStorage only.");
            return false;
        }
        
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        
        // Enable offline persistence
        await db.enablePersistence();
        
        firebaseInitialized = true;
        
        console.log("✅ Firebase initialized successfully");
        return true;
        
    } catch (error) {
        console.warn("❌ Firebase initialization failed:", error.message);
        return false;
    }
}

// ======================
// ENHANCED AUTHENTICATION
// ======================
function loginUser(email, password) {
    // Vincent's Admin Credentials
    if (email === "vincentgichana89@gmail.com" && password === "Vin@40385106") {
        let existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            if (existingUser.role !== 'admin') {
                existingUser.role = 'admin';
                existingUser.status = 'active';
                dataManager.updateRecord('users', existingUser.id, { 
                    role: 'admin', 
                    status: 'active',
                    lastRoleChange: {
                        date: new Date().toISOString(),
                        changedBy: 'system',
                        fromRole: existingUser.role,
                        toRole: 'admin'
                    }
                });
            }
            existingUser.lastLogin = new Date().toISOString();
            return { success: true, user: existingUser };
        } else {
            const newAdminUser = {
                id: `admin-${Date.now()}`,
                firstName: "Vincent",
                lastName: "Gichana",
                email: email,
                password: password,
                role: "admin",
                status: "active",
                requestedRole: null,
                approvedBy: null,
                approvedAt: new Date().toISOString(),
                lastRoleChange: null,
                suspensionReason: null,
                assignedPatients: [],
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            
            users.push(newAdminUser);
            dataManager.saveToLocalStorage('users', newAdminUser);
            
            return { success: true, user: newAdminUser };
        }
    }
    
    // Check demo users
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, message: "Invalid email or password" };
    }
    
    if (user.status === 'pending') {
        return { 
            success: false, 
            message: "Your account is pending administrator approval." 
        };
    }
    
    if (user.status === 'suspended') {
        return { 
            success: false, 
            message: `Account suspended. Reason: ${user.suspensionReason || 'No reason provided'}` 
        };
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    dataManager.updateLocalRecord('users', user.id, { lastLogin: user.lastLogin });
    
    return { success: true, user };
}

async function registerUser(userData) {
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
        return { success: false, message: "Email already registered" };
    }

    let newUser;
    const registrationDate = new Date().toISOString();
    
    if (userData.role === 'patient') {
        // Patients get immediate access
        newUser = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            role: 'patient',
            status: 'active',
            requestedRole: null,
            approvedBy: null,
            approvedAt: registrationDate,
            lastRoleChange: null,
            suspensionReason: null,
            assignedPatients: [],
            createdAt: registrationDate,
            lastLogin: registrationDate
        };
        
        // Create corresponding patient record
        const patientData = {
            userId: null, // Will be updated after user creation
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: '',
            status: 'active',
            createdAt: registrationDate
        };
        
        const patientResult = await dataManager.saveToFirebase('patients', patientData);
        if (patientResult.success) {
            newUser.patientId = patientResult.id;
        }
    } else if (['doctor', 'nurse', 'staff'].includes(userData.role)) {
        // Professionals require approval
        newUser = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            role: 'pending_approval',
            status: 'pending',
            requestedRole: userData.role,
            approvedBy: null,
            approvedAt: null,
            lastRoleChange: null,
            suspensionReason: null,
            assignedPatients: [],
            createdAt: registrationDate
        };
    } else {
        return { 
            success: false, 
            message: "Administrator accounts cannot be self-registered." 
        };
    }

    const result = await dataManager.saveToFirebase('users', newUser);
    
    if (result.success) {
        newUser.id = result.id;
        users.push(newUser);
        
        if (newUser.role === 'patient' && newUser.patientId) {
            // Update patient record with userId
            await dataManager.updateRecord('patients', newUser.patientId, { userId: newUser.id });
        }
        
        return { 
            success: true, 
            user: newUser,
            message: newUser.role === 'patient' 
                ? 'Registration successful! You can now log in.' 
                : 'Registration submitted! Your account requires administrator approval.'
        };
    } else {
        return { success: false, message: "Failed to create user account" };
    }
}

// ======================
// ENHANCED ROLE MANAGEMENT
// ======================
async function changeUserRole(targetUserId, newRole, reason = '') {
    if (currentUser.role !== 'admin') {
        return { success: false, message: "Only administrators can assign roles" };
    }
    
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) {
        return { success: false, message: "User not found" };
    }
    
    if (targetUserId === currentUser.id) {
        return { success: false, message: "You cannot change your own role" };
    }
    
    if (targetUser.role === 'admin' && newRole !== 'admin') {
        const adminCount = users.filter(u => u.role === 'admin' && u.status === 'active').length;
        if (adminCount <= 1) {
            return { success: false, message: "Cannot demote the last administrator" };
        }
    }
    
    const validRoles = ['admin', 'doctor', 'nurse', 'staff', 'patient', 'pending_approval'];
    if (!validRoles.includes(newRole)) {
        return { success: false, message: "Invalid role specified" };
    }
    
    const updateData = {
        role: newRole,
        status: newRole === 'pending_approval' ? 'pending' : 'active',
        lastRoleChange: {
            date: new Date().toISOString(),
            changedBy: currentUser.id,
            fromRole: targetUser.role,
            toRole: newRole
        }
    };
    
    if (targetUser.role === 'pending_approval' && newRole !== 'pending_approval') {
        updateData.approvedBy = currentUser.id;
        updateData.approvedAt = new Date().toISOString();
        updateData.requestedRole = null;
    }
    
    const result = await dataManager.updateRecord('users', targetUserId, updateData);
    
    if (result.success) {
        // Update local user
        const userIndex = users.findIndex(u => u.id === targetUserId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updateData };
        }
        
        return { 
            success: true, 
            message: `Role changed successfully. ${targetUser.firstName} ${targetUser.lastName} is now a ${getRoleDisplayName(newRole)}.`
        };
    } else {
        return { success: false, message: "Failed to update user role" };
    }
}

async function logRoleChange(userId, fromRole, toRole, changedBy, reason) {
    const adminUser = users.find(u => u.id === changedBy);
    const targetUser = users.find(u => u.id === userId);
    
    const logEntry = {
        userId: userId,
        userName: targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'Unknown',
        userEmail: targetUser ? targetUser.email : 'Unknown',
        changedBy: changedBy,
        adminName: adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Unknown',
        adminEmail: adminUser ? adminUser.email : 'Unknown',
        fromRole: fromRole,
        toRole: toRole,
        timestamp: new Date().toISOString(),
        reason: reason
    };
    
    await dataManager.saveToFirebase('role_change_logs', logEntry);
    roleChangeLogs.push({ id: Date.now().toString(), ...logEntry });
}

// ======================
// ENHANCED UI FUNCTIONS
// ======================
function setCurrentUser(user) {
    currentUser = user;
    updateUIForUser(user);
    
    if (user.status === 'active' && user.role !== 'pending_approval') {
        showDashboardForRole(user.role);
    } else if (user.status === 'pending') {
        showPendingApprovalScreen();
    }
    
    localStorage.setItem('mdhms_current_user', JSON.stringify(user));
    
    if (user.role === 'pending_approval') {
        showToast('Account Pending', 'Your account is awaiting administrator approval.', 'info');
    } else {
        showToast('Login Successful', `Welcome ${user.firstName}!`, 'success');
    }
}

function updateUIForUser(user) {
    const fullName = `${user.firstName} ${user.lastName}`;
    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    const roleName = getRoleDisplayName(user.role);
    const status = user.status;

    userName.textContent = fullName;
    userAvatar.textContent = initials;
    
    if (status === 'pending') {
        userRoleBadge.textContent = 'Pending';
        userRoleBadge.className = 'role-badge role-pending';
    } else if (status === 'suspended') {
        userRoleBadge.textContent = 'Suspended';
        userRoleBadge.className = 'role-badge role-suspended';
    } else {
        userRoleBadge.textContent = roleName;
        userRoleBadge.className = `role-badge role-${user.role}`;
    }
    
    userInfo.classList.add('active');
    authBtn.style.display = 'none';
    logoutBtn.style.display = 'flex';
    dashboardNav.style.display = 'block';
}

function showDashboardForRole(role) {
    pendingApprovalScreen.style.display = 'none';
    regularDashboard.style.display = 'block';
    
    dashboardTitle.textContent = getDashboardTitle(role);
    dashboardSubtitle.textContent = getDashboardSubtitle(role);
    welcomeUserName.textContent = currentUser.firstName;
    welcomeUserRole.textContent = getRoleDisplayName(role);
    
    createDashboardTabs(role);
    createQuickActions(role);
    dashboardSection.classList.add('active');
    
    if (rolePermissions[role].tabs.length > 0) {
        showTabContent(rolePermissions[role].tabs[0].id);
    }
}

function createDashboardTabs(role) {
    dashboardTabs.innerHTML = '';
    const tabs = rolePermissions[role].tabs;
    
    tabs.forEach((tab, index) => {
        const tabElement = document.createElement('button');
        tabElement.className = `dashboard-tab ${index === 0 ? 'active' : ''}`;
        tabElement.innerHTML = `<i class="fas ${tab.icon}"></i> <span>${tab.name}</span>`;
        tabElement.onclick = () => {
            document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
            tabElement.classList.add('active');
            showTabContent(tab.id);
        };
        dashboardTabs.appendChild(tabElement);
    });
}

function createQuickActions(role) {
    const quickActions = rolePermissions[role].quickActions;
    
    if (quickActions.length === 0) {
        quickActionsBar.style.display = 'none';
        return;
    }
    
    quickActionsBar.style.display = 'block';
    quickActionsButtons.innerHTML = '';
    
    quickActions.forEach(action => {
        const button = document.createElement('button');
        button.className = `quick-action-btn btn-${action.color}`;
        button.innerHTML = `<i class="fas ${action.icon}"></i> ${action.name}`;
        button.onclick = () => executeQuickActionFunction(action.id);
        quickActionsButtons.appendChild(button);
    });
}

function executeQuickActionFunction(actionId) {
    switch(actionId) {
        case 'add-patient':
            openAddPatientModal();
            break;
        case 'schedule-appointment':
            openScheduleAppointmentModal();
            break;
        case 'create-invoice':
            openCreateInvoiceModal();
            break;
        case 'view-reports':
            showReportsTab();
            break;
        case 'prescribe-medication':
            openPrescribeMedicationModal();
            break;
        case 'add-medical-record':
            openAddMedicalRecordModal();
            break;
        case 'add-lab-result':
            openAddLabResultModal();
            break;
        case 'add-nursing-note':
            openAddNursingNoteModal();
            break;
        case 'process-payment':
            showBillingTab();
            break;
        case 'view-medical-records':
            showMedicalRecordsTab();
            break;
        case 'pay-bills':
            showBillingTab();
            break;
        case 'view-prescriptions':
            showMedicationsTab();
            break;
        case 'view-vitals':
            showMedicalRecordsTab();
            break;
    }
}

// ======================
// ENHANCED TAB CONTENT MANAGEMENT
// ======================
function showTabContent(tabId) {
    dashboardContent.innerHTML = '<div class="spinner"></div>';
    
    setTimeout(() => {
        switch(tabId) {
            case 'patients':
            case 'my-records':
                showPatientsTab(tabId);
                break;
            case 'appointments':
                showAppointmentsTab();
                break;
            case 'medical':
                showMedicalRecordsTab();
                break;
            case 'lab':
                showLabResultsTab();
                break;
            case 'medications':
                showMedicationsTab();
                break;
            case 'billing':
                showBillingTab();
                break;
            case 'users':
                showUsersTab();
                break;
            case 'reports':
                showReportsTab();
                break;
        }
    }, 300);
}

// ======================
// ENHANCED PATIENTS TAB
// ======================
function showPatientsTab(tabId) {
    if (currentUser.role === 'patient') {
        showPatientPersonalView();
        return;
    }
    
    const searchTerm = localStorage.getItem('patient_search') || '';
    const statusFilter = localStorage.getItem('patient_status') || '';
    const page = currentPage.patients;
    
    const { data: paginatedPatients, pagination } = dataManager.getPaginatedData(
        'patients', 
        page, 
        searchTerm, 
        { status: statusFilter }
    );
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-user-injured"></i> Patient Management</h3>
            
            <!-- Patient Selection Dropdown for Actions -->
            <div class="patient-select-container" style="margin-bottom: 25px;">
                ${generatePatientDropdown('', true, 'globalPatientSelect', true)}
            </div>
            
            <!-- Search and Filter Bar -->
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="patientSearch" placeholder="Search patients by name, ID, or email..." value="${searchTerm}">
                </div>
                <div class="filter-options">
                    <button class="filter-btn ${!statusFilter ? 'active' : ''}" onclick="filterPatients('')">All</button>
                    <button class="filter-btn ${statusFilter === 'active' ? 'active' : ''}" onclick="filterPatients('active')">Active</button>
                    <button class="filter-btn ${statusFilter === 'inactive' ? 'active' : ''}" onclick="filterPatients('inactive')">Inactive</button>
                </div>
                ${currentUser.role === 'admin' || currentUser.role === 'staff' || currentUser.role === 'doctor' ? `
                    <button class="btn btn-primary" onclick="openAddPatientModal()">
                        <i class="fas fa-user-plus"></i> Add Patient
                    </button>
                ` : ''}
            </div>
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Patients</h5>
                    <div class="value">${patients.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Active</h5>
                    <div class="value" style="color: var(--success);">${patients.filter(p => p.status === 'active').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>This Month</h5>
                    <div class="value">${patients.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>With Insurance</h5>
                    <div class="value" style="color: var(--primary);">${patients.filter(p => p.insuranceProvider && p.insuranceProvider !== 'None').length}</div>
                </div>
            </div>
            
            <!-- Patient List -->
            <h4><i class="fas fa-list"></i> Patient List (${pagination.totalItems})</h4>
            
            ${paginatedPatients.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-user-injured"></i>
                    <p>No patients found</p>
                    ${searchTerm ? '<p>Try a different search term</p>' : ''}
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Date of Birth</th>
                                <th>Insurance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedPatients.map(patient => `
                                <tr>
                                    <td><strong>${patient.id}</strong></td>
                                    <td>
                                        <div class="patient-name">
                                            <strong>${patient.firstName} ${patient.lastName}</strong>
                                            ${patient.gender ? `<br><small>${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</small>` : ''}
                                        </div>
                                    </td>
                                    <td>
                                        <div>${patient.email || 'N/A'}</div>
                                        <small>${patient.phoneNumber || 'N/A'}</small>
                                    </td>
                                    <td>${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                                    <td>${patient.insuranceProvider || 'None'}</td>
                                    <td>
                                        <span class="status-indicator ${patient.status === 'active' ? 'status-active' : 'status-suspended'}"></span>
                                        <span class="status-badge ${patient.status === 'active' ? 'status-active' : 'status-suspended'}">
                                            ${patient.status || 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="data-table-actions">
                                            <button class="btn btn-outline btn-small" onclick="viewPatientDetails('${patient.id}')">
                                                <i class="fas fa-eye"></i> View
                                            </button>
                                            ${currentUser.role === 'admin' || currentUser.role === 'doctor' || currentUser.role === 'staff' ? `
                                                <button class="btn btn-secondary btn-small" onclick="editPatient('${patient.id}')">
                                                    <i class="fas fa-edit"></i> Edit
                                                </button>
                                            ` : ''}
                                            ${currentUser.role === 'admin' ? `
                                                <button class="btn btn-danger btn-small" onclick="deleteRecord('patients', '${patient.id}', '${patient.firstName} ${patient.lastName}')">
                                                    <i class="fas fa-trash"></i> 
                                                </button>
                                            ` : ''}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                ${pagination.totalPages > 1 ? `
                    <div class="pagination">
                        <button class="pagination-btn ${!pagination.hasPrevious ? 'disabled' : ''}" 
                                onclick="changePage('patients', ${page - 1})" 
                                ${!pagination.hasPrevious ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        ${Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            if (pagination.totalPages <= 5 || (pageNum >= page - 2 && pageNum <= page + 2)) {
                                return `
                                    <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                            onclick="changePage('patients', ${pageNum})">
                                        ${pageNum}
                                    </button>
                                `;
                            }
                            return '';
                        }).join('')}
                        
                        ${pagination.totalPages > 5 && page < pagination.totalPages - 2 ? `
                            <span class="pagination-btn disabled">...</span>
                            <button class="pagination-btn" onclick="changePage('patients', ${pagination.totalPages})">
                                ${pagination.totalPages}
                            </button>
                        ` : ''}
                        
                        <button class="pagination-btn ${!pagination.hasNext ? 'disabled' : ''}" 
                                onclick="changePage('patients', ${page + 1})" 
                                ${!pagination.hasNext ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            `}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
    
    // Add search event listener
    const searchInput = document.getElementById('patientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            localStorage.setItem('patient_search', searchInput.value);
            currentPage.patients = 1;
            showPatientsTab(tabId);
        }, 500));
    }
    
    // Add patient selection change listener
    const patientSelect = document.getElementById('globalPatientSelect');
    if (patientSelect) {
        patientSelect.addEventListener('change', function() {
            if (this.value) {
                viewPatientDetails(this.value);
            }
        });
    }
}

function showPatientPersonalView() {
    const patient = patients.find(p => p.userId === currentUser.id);
    if (!patient) {
        dashboardContent.innerHTML = `
            <div class="dashboard-content active">
                <h3><i class="fas fa-user-injured"></i> My Medical Records</h3>
                <div class="empty-state">
                    <i class="fas fa-user-injured"></i>
                    <p>No patient record found for your account.</p>
                    <p>Please contact hospital administration.</p>
                </div>
            </div>
        `;
        return;
    }

    const patientAppointments = appointments.filter(a => a.patientUserId === currentUser.id);
    const patientLabResults = labResults.filter(l => l.patientUserId === currentUser.id);
    const patientMedications = medications.filter(m => m.patientUserId === currentUser.id);
    const patientBills = billingRecords.filter(b => b.patientUserId === currentUser.id);
    const patientMedicalRecords = medicalRecords.filter(m => m.patientUserId === currentUser.id);

    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-user-injured"></i> Welcome, ${patient.firstName}!</h3>
            
            <!-- Patient Information Card -->
            <div class="medication-card">
                <div class="form-grid">
                    <div>
                        <strong>Patient ID:</strong> ${patient.id}
                    </div>
                    <div>
                        <strong>Date of Birth:</strong> ${new Date(patient.dateOfBirth).toLocaleDateString()}
                    </div>
                    <div>
                        <strong>Blood Group:</strong> ${patient.bloodGroup || 'Not specified'}
                    </div>
                    <div>
                        <strong>Insurance:</strong> ${patient.insuranceProvider || 'None'}
                    </div>
                </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Upcoming Appointments</h5>
                    <div class="value" style="color: var(--warning);">${patientAppointments.filter(a => a.status === 'scheduled').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Lab Results</h5>
                    <div class="value" style="color: var(--primary);">${patientLabResults.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Current Medications</h5>
                    <div class="value" style="color: var(--success);">${patientMedications.filter(m => m.status === 'active').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Pending Bills</h5>
                    <div class="value" style="color: var(--accent);">${patientBills.filter(b => b.status === 'unpaid').length}</div>
                </div>
            </div>
            
            <!-- Quick Action Buttons -->
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="scheduleAppointmentModal()">
                    <i class="fas fa-calendar-plus"></i> Schedule Appointment
                </button>
                <button class="btn btn-secondary" onclick="viewMyBills()">
                    <i class="fas fa-file-invoice-dollar"></i> View My Bills
                </button>
                <button class="btn btn-success" onclick="viewMyPrescriptions()">
                    <i class="fas fa-prescription"></i> My Prescriptions
                </button>
            </div>
            
            <!-- Upcoming Appointments -->
            <h4 style="margin-top: 30px;"><i class="fas fa-calendar-alt"></i> Upcoming Appointments</h4>
            ${patientAppointments.filter(a => a.status === 'scheduled').length === 0 ? `
                <div class="empty-state" style="padding: 20px;">
                    <i class="fas fa-calendar-alt"></i>
                    <p>No upcoming appointments</p>
                    <button class="btn btn-outline btn-small" onclick="scheduleAppointmentModal()">Schedule One</button>
                </div>
            ` : patientAppointments.filter(a => a.status === 'scheduled').map(appointment => `
                <div class="medication-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                        <div style="flex: 1;">
                            <h5 style="margin-bottom: 5px;">Appointment with ${appointment.doctorName}</h5>
                            <p><i class="far fa-calendar"></i> ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}</p>
                            <p><i class="fas fa-stethoscope"></i> ${appointment.reason}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${appointment.location}</p>
                        </div>
                        <div style="text-align: right;">
                            <span class="status-badge status-scheduled" style="margin-bottom: 10px; display: inline-block;">Scheduled</span>
                            <div>
                                <button class="btn btn-outline btn-small" onclick="cancelAppointment('${appointment.id}')">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                                <button class="btn btn-secondary btn-small" onclick="rescheduleAppointment('${appointment.id}')">
                                    <i class="fas fa-clock"></i> Reschedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            
            <!-- Recent Medical Records -->
            ${patientMedicalRecords.length > 0 ? `
                <h4 style="margin-top: 30px;"><i class="fas fa-file-medical-alt"></i> Recent Medical Records</h4>
                ${patientMedicalRecords.slice(0, 3).map(record => `
                    <div class="medication-card">
                        <h5 style="margin-bottom: 5px;">${record.title}</h5>
                        <p><i class="far fa-calendar"></i> ${new Date(record.date).toLocaleDateString()}</p>
                        <p><i class="fas fa-user-md"></i> ${record.doctorName}</p>
                        <p>${record.details.substring(0, 100)}...</p>
                        <button class="btn btn-outline btn-small" onclick="viewMedicalRecord('${record.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                `).join('')}
                ${patientMedicalRecords.length > 3 ? `
                    <div style="text-align: center; margin-top: 15px;">
                        <button class="btn btn-outline" onclick="showAllMedicalRecords()">
                            View All Records (${patientMedicalRecords.length})
                        </button>
                    </div>
                ` : ''}
            ` : ''}
            
            <!-- Current Medications -->
            ${patientMedications.filter(m => m.status === 'active').length > 0 ? `
                <h4 style="margin-top: 30px;"><i class="fas fa-pills"></i> Current Medications</h4>
                ${patientMedications.filter(m => m.status === 'active').map(med => `
                    <div class="medication-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <div style="flex: 1;">
                                <h5 style="margin-bottom: 5px;">${med.medicationName}</h5>
                                <p><i class="fas fa-prescription-bottle-alt"></i> ${med.dosage} - ${med.frequency}</p>
                                <p><i class="fas fa-user-md"></i> Prescribed by: ${med.prescribedByName}</p>
                                <p><i class="fas fa-calendar"></i> Prescribed: ${new Date(med.prescribedAt).toLocaleDateString()}</p>
                                <p><i class="fas fa-info-circle"></i> ${med.instructions}</p>
                            </div>
                            <div style="text-align: right;">
                                <span class="status-badge status-active">Active</span>
                                <div style="margin-top: 10px;">
                                    <button class="btn btn-outline btn-small" onclick="requestRefill('${med.id}')">
                                        <i class="fas fa-redo"></i> Request Refill
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            ` : ''}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
}

// ======================
// ENHANCED APPOINTMENTS TAB
// ======================
function showAppointmentsTab() {
    let userAppointments = [];
    let canCreate = false;
    
    if (currentUser.role === 'patient') {
        userAppointments = appointments.filter(a => a.patientUserId === currentUser.id);
        canCreate = true;
    } else if (currentUser.role === 'doctor') {
        userAppointments = appointments.filter(a => a.doctorId === currentUser.id);
        canCreate = true;
    } else if (currentUser.role === 'nurse' || currentUser.role === 'staff') {
        userAppointments = appointments;
        canCreate = true;
    } else if (currentUser.role === 'admin') {
        userAppointments = appointments;
        canCreate = true;
    }
    
    const searchTerm = localStorage.getItem('appointment_search') || '';
    const statusFilter = localStorage.getItem('appointment_status') || '';
    const page = currentPage.appointments;
    
    // Filter appointments
    let filteredAppointments = userAppointments;
    
    if (searchTerm) {
        filteredAppointments = filteredAppointments.filter(a => 
            (a.patientId && a.patientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.doctorName && a.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.reason && a.reason.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }
    
    if (statusFilter) {
        filteredAppointments = filteredAppointments.filter(a => a.status === statusFilter);
    }
    
    // Calculate pagination
    const totalItems = filteredAppointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-calendar-alt"></i> Appointment Management</h3>
            
            <!-- Patient Selection Dropdown -->
            ${currentUser.role !== 'patient' ? `
                <div class="patient-select-container" style="margin-bottom: 25px;">
                    ${generatePatientDropdown('', true, 'appointmentPatientSelect')}
                </div>
            ` : ''}
            
            <!-- Search and Filter Bar -->
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="appointmentSearch" placeholder="Search appointments..." value="${searchTerm}">
                </div>
                <div class="filter-options">
                    <button class="filter-btn ${!statusFilter ? 'active' : ''}" onclick="filterAppointments('')">All</button>
                    <button class="filter-btn ${statusFilter === 'scheduled' ? 'active' : ''}" onclick="filterAppointments('scheduled')">Scheduled</button>
                    <button class="filter-btn ${statusFilter === 'completed' ? 'active' : ''}" onclick="filterAppointments('completed')">Completed</button>
                    <button class="filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}" onclick="filterAppointments('cancelled')">Cancelled</button>
                </div>
                ${canCreate ? `
                    <button class="btn btn-primary" onclick="openScheduleAppointmentModal()">
                        <i class="fas fa-plus"></i> Schedule Appointment
                    </button>
                ` : ''}
            </div>
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Appointments</h5>
                    <div class="value">${filteredAppointments.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Scheduled</h5>
                    <div class="value" style="color: var(--warning);">${filteredAppointments.filter(a => a.status === 'scheduled').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Today</h5>
                    <div class="value" style="color: var(--primary);">${filteredAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Completion Rate</h5>
                    <div class="value" style="color: var(--success);">${filteredAppointments.length > 0 ? Math.round((filteredAppointments.filter(a => a.status === 'completed').length / filteredAppointments.length) * 100) : 0}%</div>
                </div>
            </div>
            
            <!-- Appointments List -->
            <h4><i class="fas fa-list"></i> Appointments (${totalItems})</h4>
            
            ${paginatedAppointments.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <p>No appointments found</p>
                    ${searchTerm ? '<p>Try a different search term</p>' : ''}
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedAppointments.map(appointment => {
                                const patient = patients.find(p => p.id === appointment.patientId);
                                return `
                                    <tr>
                                        <td>
                                            <div><strong>${new Date(appointment.date).toLocaleDateString()}</strong></div>
                                            <small>${appointment.time}</small>
                                        </td>
                                        <td>${patient ? `<strong>${patient.firstName} ${patient.lastName}</strong><br><small>${patient.id}</small>` : appointment.patientId}</td>
                                        <td>${appointment.doctorName}</td>
                                        <td>
                                            <span style="display: inline-block; padding: 4px 8px; background: #e3f2fd; border-radius: 4px; font-size: 0.85rem;">
                                                ${appointment.type}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-badge status-${appointment.status}">
                                                ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="data-table-actions">
                                                <button class="btn btn-outline btn-small" onclick="viewAppointmentDetails('${appointment.id}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                ${(currentUser.role === 'admin' || currentUser.role === 'doctor' || currentUser.role === 'nurse' || currentUser.role === 'staff') && appointment.status === 'scheduled' ? `
                                                    <button class="btn btn-secondary btn-small" onclick="editAppointment('${appointment.id}')">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button class="btn btn-success btn-small" onclick="completeAppointment('${appointment.id}')">
                                                        <i class="fas fa-check"></i>
                                                    </button>
                                                    <button class="btn btn-danger btn-small" onclick="cancelAppointment('${appointment.id}')">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                ` : ''}
                                                ${currentUser.role === 'patient' && appointment.status === 'scheduled' ? `
                                                    <button class="btn btn-danger btn-small" onclick="cancelAppointment('${appointment.id}')">
                                                        <i class="fas fa-times"></i> Cancel
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                ${totalPages > 1 ? `
                    <div class="pagination">
                        <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                                onclick="changePage('appointments', ${page - 1})" 
                                ${page <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            if (totalPages <= 5 || (pageNum >= page - 2 && pageNum <= page + 2)) {
                                return `
                                    <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                            onclick="changePage('appointments', ${pageNum})">
                                        ${pageNum}
                                    </button>
                                `;
                            }
                            return '';
                        }).join('')}
                        
                        ${totalPages > 5 && page < totalPages - 2 ? `
                            <span class="pagination-btn disabled">...</span>
                            <button class="pagination-btn" onclick="changePage('appointments', ${totalPages})">
                                ${totalPages}
                            </button>
                        ` : ''}
                        
                        <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                                onclick="changePage('appointments', ${page + 1})" 
                                ${page >= totalPages ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            `}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
    
    // Add search event listener
    const searchInput = document.getElementById('appointmentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            localStorage.setItem('appointment_search', searchInput.value);
            currentPage.appointments = 1;
            showAppointmentsTab();
        }, 500));
    }
    
    // Add patient selection change listener
    const patientSelect = document.getElementById('appointmentPatientSelect');
    if (patientSelect) {
        patientSelect.addEventListener('change', function() {
            if (this.value) {
                // Filter appointments for selected patient
                localStorage.setItem('appointment_search', this.value);
                currentPage.appointments = 1;
                showAppointmentsTab();
            } else {
                localStorage.removeItem('appointment_search');
                currentPage.appointments = 1;
                showAppointmentsTab();
            }
        });
    }
}

// ======================
// ENHANCED MEDICAL RECORDS TAB
// ======================
function showMedicalRecordsTab() {
    let userMedicalRecords = [];
    
    if (currentUser.role === 'patient') {
        userMedicalRecords = medicalRecords.filter(m => m.patientUserId === currentUser.id);
    } else if (currentUser.role === 'doctor' || currentUser.role === 'nurse') {
        userMedicalRecords = medicalRecords;
    } else if (currentUser.role === 'admin') {
        userMedicalRecords = medicalRecords;
    }
    
    const page = currentPage.medical;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRecords = userMedicalRecords.slice(startIndex, endIndex);
    const totalPages = Math.ceil(userMedicalRecords.length / itemsPerPage);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-file-medical-alt"></i> Medical Records</h3>
            
            <!-- Patient Selection Dropdown -->
            ${currentUser.role !== 'patient' ? `
                <div class="patient-select-container" style="margin-bottom: 25px;">
                    ${generatePatientDropdown('', true, 'medicalRecordPatientSelect')}
                </div>
            ` : ''}
            
            <!-- Action Buttons -->
            ${currentUser.role !== 'patient' ? `
                <div class="search-filter-bar">
                    <div class="search-box">
                        <input type="text" id="medicalSearch" placeholder="Search records...">
                    </div>
                    <button class="btn btn-primary" onclick="openAddMedicalRecordModal()">
                        <i class="fas fa-plus"></i> Add Medical Record
                    </button>
                </div>
            ` : ''}
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Records</h5>
                    <div class="value">${userMedicalRecords.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>This Month</h5>
                    <div class="value" style="color: var(--primary);">${userMedicalRecords.filter(r => new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Progress Notes</h5>
                    <div class="value" style="color: var(--success);">${userMedicalRecords.filter(r => r.type === 'progress').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Consultations</h5>
                    <div class="value" style="color: var(--warning);">${userMedicalRecords.filter(r => r.type === 'consultation').length}</div>
                </div>
            </div>
            
            <!-- Medical Records List -->
            <h4><i class="fas fa-list"></i> Medical Records (${userMedicalRecords.length})</h4>
            
            ${paginatedRecords.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-file-medical-alt"></i>
                    <p>No medical records found</p>
                </div>
            ` : paginatedRecords.map(record => {
                const patient = patients.find(p => p.id === record.patientId);
                return `
                    <div class="medication-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                            <div style="flex: 1;">
                                <h5 style="margin-bottom: 5px;">${record.title}</h5>
                                <p><i class="far fa-calendar"></i> ${new Date(record.date).toLocaleDateString()}</p>
                                <p><i class="fas fa-user-md"></i> ${record.doctorName}</p>
                                ${currentUser.role !== 'patient' ? `<p><i class="fas fa-user-injured"></i> Patient: ${patient ? `${patient.firstName} ${patient.lastName}` : record.patientId}</p>` : ''}
                                <p>${record.details.substring(0, 150)}...</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="display: inline-block; background: ${record.type === 'progress' ? '#e3f2fd' : '#e8f5e9'}; color: ${record.type === 'progress' ? '#1976d2' : '#388e3c'}; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">
                                    ${record.type === 'progress' ? 'Progress Note' : 'Consultation'}
                                </span>
                                <div class="data-table-actions" style="margin-top: 10px;">
                                    <button class="btn btn-outline btn-small" onclick="viewMedicalRecord('${record.id}')">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    ${currentUser.role === 'admin' || currentUser.role === 'doctor' ? `
                                        <button class="btn btn-secondary btn-small" onclick="editMedicalRecord('${record.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
            
            <!-- Pagination -->
            ${totalPages > 1 ? `
                <div class="pagination">
                    <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                            onclick="changePage('medical', ${page - 1})" 
                            ${page <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return `
                            <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                    onclick="changePage('medical', ${pageNum})">
                                ${pageNum}
                            </button>
                        `;
                    }).join('')}
                    
                    <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                            onclick="changePage('medical', ${page + 1})" 
                            ${page >= totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
}

// ======================
// ENHANCED LAB RESULTS TAB
// ======================
function showLabResultsTab() {
    let userLabResults = [];
    
    if (currentUser.role === 'patient') {
        userLabResults = labResults.filter(l => l.patientUserId === currentUser.id);
    } else if (currentUser.role === 'doctor' || currentUser.role === 'nurse') {
        userLabResults = labResults;
    } else if (currentUser.role === 'admin') {
        userLabResults = labResults;
    }
    
    const page = currentPage.lab;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = userLabResults.slice(startIndex, endIndex);
    const totalPages = Math.ceil(userLabResults.length / itemsPerPage);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-flask"></i> Laboratory Results</h3>
            
            <!-- Patient Selection Dropdown -->
            ${currentUser.role !== 'patient' ? `
                <div class="patient-select-container" style="margin-bottom: 25px;">
                    ${generatePatientDropdown('', true, 'labResultPatientSelect')}
                </div>
            ` : ''}
            
            <!-- Action Buttons -->
            ${currentUser.role !== 'patient' ? `
                <div class="search-filter-bar">
                    <button class="btn btn-primary" onclick="openAddLabResultModal()">
                        <i class="fas fa-plus"></i> Upload Lab Result
                    </button>
                </div>
            ` : ''}
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Results</h5>
                    <div class="value">${userLabResults.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Blood Tests</h5>
                    <div class="value" style="color: var(--accent);">${userLabResults.filter(r => r.testType === 'blood').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Urine Tests</h5>
                    <div class="value" style="color: var(--success);">${userLabResults.filter(r => r.testType === 'urine').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>This Month</h5>
                    <div class="value" style="color: var(--primary);">${userLabResults.filter(r => new Date(r.testDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</div>
                </div>
            </div>
            
            <!-- Lab Results List -->
            <h4><i class="fas fa-list"></i> Laboratory Results (${userLabResults.length})</h4>
            
            ${paginatedResults.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-flask"></i>
                    <p>No lab results found</p>
                </div>
            ` : paginatedResults.map(result => {
                const patient = patients.find(p => p.id === result.patientId);
                return `
                    <div class="medication-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                            <div style="flex: 1;">
                                <h5 style="margin-bottom: 5px;">${result.testName}</h5>
                                <p><i class="far fa-calendar"></i> Test Date: ${new Date(result.testDate).toLocaleDateString()}</p>
                                ${currentUser.role !== 'patient' ? `<p><i class="fas fa-user-injured"></i> Patient: ${patient ? `${patient.firstName} ${patient.lastName}` : result.patientId}</p>` : ''}
                                <p><i class="fas fa-vial"></i> Type: ${result.testType.charAt(0).toUpperCase() + result.testType.slice(1)} Test</p>
                                <p>${result.result.substring(0, 100)}...</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="display: inline-block; background: #e8f5e9; color: #388e3c; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">
                                    ${result.status === 'completed' ? 'Completed' : 'Pending'}
                                </span>
                                <div class="data-table-actions" style="margin-top: 10px;">
                                    <button class="btn btn-outline btn-small" onclick="viewLabResult('${result.id}')">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    ${currentUser.role === 'admin' || currentUser.role === 'doctor' ? `
                                        <button class="btn btn-secondary btn-small" onclick="editLabResult('${result.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
            
            <!-- Pagination -->
            ${totalPages > 1 ? `
                <div class="pagination">
                    <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                            onclick="changePage('lab', ${page - 1})" 
                            ${page <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return `
                            <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                    onclick="changePage('lab', ${pageNum})">
                                ${pageNum}
                            </button>
                        `;
                    }).join('')}
                    
                    <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                            onclick="changePage('lab', ${page + 1})" 
                            ${page >= totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
}

// ======================
// ENHANCED MEDICATIONS TAB
// ======================
function showMedicationsTab() {
    let userMedications = [];
    
    if (currentUser.role === 'patient') {
        userMedications = medications.filter(m => m.patientUserId === currentUser.id);
    } else if (currentUser.role === 'doctor') {
        userMedications = medications.filter(m => m.prescribedBy === currentUser.id);
    } else if (currentUser.role === 'nurse' || currentUser.role === 'admin') {
        userMedications = medications;
    }
    
    const page = currentPage.medications;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMedications = userMedications.slice(startIndex, endIndex);
    const totalPages = Math.ceil(userMedications.length / itemsPerPage);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-pills"></i> ${currentUser.role === 'patient' ? 'My Medications' : 'Medication Management'}</h3>
            
            <!-- Patient Selection Dropdown -->
            ${currentUser.role !== 'patient' ? `
                <div class="patient-select-container" style="margin-bottom: 25px;">
                    ${generatePatientDropdown('', true, 'medicationPatientSelect')}
                </div>
            ` : ''}
            
            <!-- Action Buttons -->
            ${currentUser.role === 'doctor' || currentUser.role === 'admin' ? `
                <div class="search-filter-bar">
                    <button class="btn btn-primary" onclick="openPrescribeMedicationModal()">
                        <i class="fas fa-prescription"></i> Prescribe Medication
                    </button>
                </div>
            ` : ''}
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Medications</h5>
                    <div class="value">${userMedications.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Active</h5>
                    <div class="value" style="color: var(--success);">${userMedications.filter(m => m.status === 'active').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Completed</h5>
                    <div class="value" style="color: var(--primary);">${userMedications.filter(m => m.status === 'completed').length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>This Month</h5>
                    <div class="value" style="color: var(--warning);">${userMedications.filter(m => new Date(m.prescribedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</div>
                </div>
            </div>
            
            <!-- Medications List -->
            <h4><i class="fas fa-list"></i> Medications (${userMedications.length})</h4>
            
            ${paginatedMedications.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-pills"></i>
                    <p>No medications found</p>
                </div>
            ` : paginatedMedications.map(medication => {
                const patient = patients.find(p => p.id === medication.patientId);
                return `
                    <div class="medication-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                            <div style="flex: 1;">
                                <h5 style="margin-bottom: 5px;">${medication.medicationName}</h5>
                                <p><i class="fas fa-prescription-bottle-alt"></i> Dosage: ${medication.dosage} - ${medication.frequency}</p>
                                ${currentUser.role !== 'patient' ? `<p><i class="fas fa-user-injured"></i> Patient: ${patient ? `${patient.firstName} ${patient.lastName}` : medication.patientId}</p>` : ''}
                                <p><i class="fas fa-user-md"></i> Prescribed by: ${medication.prescribedByName}</p>
                                <p><i class="far fa-calendar"></i> Prescribed: ${new Date(medication.prescribedAt).toLocaleDateString()}</p>
                                ${medication.notes ? `<p><i class="fas fa-info-circle"></i> ${medication.notes}</p>` : ''}
                            </div>
                            <div style="text-align: right;">
                                <span class="status-badge ${medication.status === 'active' ? 'status-active' : 'status-completed'}">
                                    ${medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                                </span>
                                <div class="data-table-actions" style="margin-top: 10px;">
                                    <button class="btn btn-outline btn-small" onclick="viewMedicationDetails('${medication.id}')">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    ${(currentUser.role === 'admin' || currentUser.role === 'doctor') && medication.status === 'active' ? `
                                        <button class="btn btn-secondary btn-small" onclick="editMedication('${medication.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-success btn-small" onclick="completeMedication('${medication.id}')">
                                            <i class="fas fa-check"></i> Complete
                                        </button>
                                    ` : ''}
                                    ${currentUser.role === 'patient' && medication.status === 'active' ? `
                                        <button class="btn btn-warning btn-small" onclick="requestRefill('${medication.id}')">
                                            <i class="fas fa-redo"></i> Refill
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
            
            <!-- Pagination -->
            ${totalPages > 1 ? `
                <div class="pagination">
                    <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                            onclick="changePage('medications', ${page - 1})" 
                            ${page <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return `
                            <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                    onclick="changePage('medications', ${pageNum})">
                                ${pageNum}
                            </button>
                        `;
                    }).join('')}
                    
                    <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                            onclick="changePage('medications', ${page + 1})" 
                            ${page >= totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
}

// ======================
// ENHANCED BILLING TAB WITH KENYAN PAYMENT SYSTEMS
// ======================
// Fix showBillingTab function
function showBillingTab() {
    let userBills = [];
    let canManage = false;
    
    if (currentUser.role === 'patient') {
        userBills = billingRecords.filter(b => b.patientUserId === currentUser.id);
        canManage = false;
    } else if (currentUser.role === 'staff' || currentUser.role === 'admin') {
        userBills = billingRecords;
        canManage = true;
    }
    
    const searchTerm = localStorage.getItem('billing_search') || '';
    const statusFilter = localStorage.getItem('billing_status') || '';
    const page = currentPage.billing || 1;
    
    // Filter bills
    let filteredBills = userBills;
    
    if (searchTerm) {
        filteredBills = filteredBills.filter(b => {
            const searchLower = searchTerm.toLowerCase();
            const billString = `
                ${b.invoiceNumber || ''} 
                ${b.patientId || ''} 
                ${b.description || ''}
            `.toLowerCase();
            return billString.includes(searchLower);
        });
    }
    
    if (statusFilter && statusFilter !== 'all') {
        filteredBills = filteredBills.filter(b => b.status === statusFilter);
    }
    
    // Calculate pagination
    const totalItems = filteredBills.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedBills = filteredBills.slice(startIndex, endIndex);
    
    // Calculate statistics
    const totalRevenue = filteredBills
        .filter(b => b.status === 'paid')
        .reduce((sum, bill) => sum + (parseFloat(bill.total) || 0), 0);
    
    const pendingAmount = filteredBills
        .filter(b => b.status === 'unpaid')
        .reduce((sum, bill) => sum + (parseFloat(bill.total) || 0), 0);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-file-invoice-dollar"></i> ${currentUser.role === 'patient' ? 'My Bills' : 'Billing Management'}</h3>
            
            <!-- Patient Selection Dropdown -->
            ${currentUser.role !== 'patient' ? `
                <div class="patient-select-container" style="margin-bottom: 25px;">
                    ${generatePatientDropdown('', true, 'billingPatientSelect')}
                </div>
            ` : ''}
            
            <!-- Search and Filter Bar -->
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="billingSearch" placeholder="Search invoices..." value="${searchTerm}">
                </div>
                <div class="filter-options">
                    <button class="filter-btn ${!statusFilter || statusFilter === 'all' ? 'active' : ''}" onclick="filterBilling('all')">All</button>
                    <button class="filter-btn ${statusFilter === 'paid' ? 'active' : ''}" onclick="filterBilling('paid')">Paid</button>
                    <button class="filter-btn ${statusFilter === 'unpaid' ? 'active' : ''}" onclick="filterBilling('unpaid')">Unpaid</button>
                </div>
                ${canManage ? `
                    <button class="btn btn-primary" onclick="openCreateInvoiceModal()">
                        <i class="fas fa-plus"></i> Create Invoice
                    </button>
                ` : ''}
            </div>
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Invoices</h5>
                    <div class="value">${filteredBills.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Total Revenue</h5>
                    <div class="value" style="color: var(--success);">KES ${totalRevenue.toLocaleString()}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Pending Amount</h5>
                    <div class="value" style="color: var(--accent);">KES ${pendingAmount.toLocaleString()}</div>
                </div>
                <div class="stat-card-small">
                    <h5>This Month</h5>
                    <div class="value" style="color: var(--primary);">
                        ${filteredBills.filter(b => {
                            const billDate = b.billingDate ? new Date(b.billingDate) : null;
                            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                            return billDate && billDate > monthAgo;
                        }).length}
                    </div>
                </div>
            </div>
            
            <!-- Billing Records List -->
            <h4><i class="fas fa-list"></i> Invoices (${totalItems})</h4>
            
            ${paginatedBills.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-file-invoice-dollar"></i>
                    <p>No invoices found</p>
                    ${searchTerm ? '<p>Try a different search term</p>' : ''}
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedBills.map(bill => {
                                const patient = patients.find(p => p.id === bill.patientId);
                                const patientName = patient ? `${patient.firstName} ${patient.lastName}` : (bill.patientId || 'N/A');
                                const billDate = bill.billingDate ? new Date(bill.billingDate).toLocaleDateString() : 'N/A';
                                const billTotal = parseFloat(bill.total) || 0;
                                
                                return `
                                    <tr>
                                        <td><strong>${bill.invoiceNumber || 'N/A'}</strong></td>
                                        <td>${patientName}</td>
                                        <td>${billDate}</td>
                                        <td>${bill.description || 'N/A'}</td>
                                        <td><strong>KES ${billTotal.toLocaleString()}</strong></td>
                                        <td>
                                            <span class="status-badge ${bill.status === 'paid' ? 'status-paid' : 'status-unpaid'}">
                                                ${bill.status || 'unpaid'}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="data-table-actions">
                                                <button class="btn btn-outline btn-small" onclick="viewInvoiceDetails('${bill.id}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                ${bill.status === 'unpaid' ? `
                                                    ${currentUser.role === 'patient' ? `
                                                        <button class="btn btn-success btn-small" onclick="payBill('${bill.id}')">
                                                            <i class="fas fa-credit-card"></i> Pay
                                                        </button>
                                                    ` : ''}
                                                    ${canManage ? `
                                                        <button class="btn btn-secondary btn-small" onclick="editInvoice('${bill.id}')">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                        <button class="btn btn-success btn-small" onclick="markAsPaid('${bill.id}')">
                                                            <i class="fas fa-check"></i> Mark Paid
                                                        </button>
                                                    ` : ''}
                                                ` : ''}
                                                ${canManage ? `
                                                    <button class="btn btn-danger btn-small" onclick="deleteRecord('billing', '${bill.id}', '${bill.invoiceNumber || 'Invoice'}')">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                ${totalPages > 1 ? `
                    <div class="pagination">
                        <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                                onclick="changePage('billing', ${page - 1})" 
                                ${page <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            if (totalPages <= 5 || (pageNum >= page - 2 && pageNum <= page + 2)) {
                                return `
                                    <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                            onclick="changePage('billing', ${pageNum})">
                                        ${pageNum}
                                    </button>
                                `;
                            }
                            return '';
                        }).filter(Boolean).join('')}
                        
                        ${totalPages > 5 && page < totalPages - 2 ? `
                            <span class="pagination-btn disabled">...</span>
                            <button class="pagination-btn" onclick="changePage('billing', ${totalPages})">
                                ${totalPages}
                            </button>
                        ` : ''}
                        
                        <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                                onclick="changePage('billing', ${page + 1})" 
                                ${page >= totalPages ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            `}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
    
    // Add search event listener
    const searchInput = document.getElementById('billingSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            localStorage.setItem('billing_search', searchInput.value);
            currentPage.billing = 1;
            showBillingTab();
        }, 500));
    }
    
    // Add patient selection change listener
    const patientSelect = document.getElementById('billingPatientSelect');
    if (patientSelect) {
        patientSelect.addEventListener('change', function() {
            if (this.value) {
                localStorage.setItem('billing_search', this.value);
                currentPage.billing = 1;
                showBillingTab();
            } else {
                localStorage.removeItem('billing_search');
                currentPage.billing = 1;
                showBillingTab();
            }
        });
    }
}

// Fix showMedicalRecordsTab function
function showMedicalRecordsTab() {
    let userMedicalRecords = [];
    
    if (currentUser.role === 'patient') {
        userMedicalRecords = medicalRecords.filter(m => m.patientUserId === currentUser.id);
    } else if (currentUser.role === 'doctor' || currentUser.role === 'nurse') {
        userMedicalRecords = medicalRecords;
    } else if (currentUser.role === 'admin') {
        userMedicalRecords = medicalRecords;
    }
    
    const page = currentPage.medical || 1;
    const totalItems = userMedicalRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedRecords = userMedicalRecords.slice(startIndex, endIndex);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-file-medical-alt"></i> Medical Records</h3>
            
            <!-- Patient Selection Dropdown -->
            ${currentUser.role !== 'patient' ? `
                <div class="patient-select-container" style="margin-bottom: 25px;">
                    ${generatePatientDropdown('', true, 'medicalRecordPatientSelect')}
                </div>
            ` : ''}
            
            <!-- Action Buttons -->
            ${currentUser.role !== 'patient' ? `
                <div class="search-filter-bar">
                    <div class="search-box">
                        <input type="text" id="medicalSearch" placeholder="Search records...">
                    </div>
                    <button class="btn btn-primary" onclick="openAddMedicalRecordModal()">
                        <i class="fas fa-plus"></i> Add Medical Record
                    </button>
                </div>
            ` : ''}
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Records</h5>
                    <div class="value">${userMedicalRecords.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>This Month</h5>
                    <div class="value" style="color: var(--primary);">
                        ${userMedicalRecords.filter(r => {
                            const recordDate = r.date ? new Date(r.date) : null;
                            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                            return recordDate && recordDate > monthAgo;
                        }).length}
                    </div>
                </div>
                <div class="stat-card-small">
                    <h5>Progress Notes</h5>
                    <div class="value" style="color: var(--success);">
                        ${userMedicalRecords.filter(r => r.type === 'progress').length}
                    </div>
                </div>
                <div class="stat-card-small">
                    <h5>Consultations</h5>
                    <div class="value" style="color: var(--warning);">
                        ${userMedicalRecords.filter(r => r.type === 'consultation').length}
                    </div>
                </div>
            </div>
            
            <!-- Medical Records List -->
            <h4><i class="fas fa-list"></i> Medical Records (${totalItems})</h4>
            
            ${paginatedRecords.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-file-medical-alt"></i>
                    <p>No medical records found</p>
                </div>
            ` : paginatedRecords.map(record => {
                const patient = patients.find(p => p.id === record.patientId);
                const patientName = patient ? `${patient.firstName} ${patient.lastName}` : (record.patientId || 'N/A');
                const recordDate = record.date ? new Date(record.date).toLocaleDateString() : 'N/A';
                const details = record.details || '';
                const shortDetails = details.length > 150 ? details.substring(0, 150) + '...' : details;
                
                return `
                    <div class="medication-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                            <div style="flex: 1;">
                                <h5 style="margin-bottom: 5px;">${record.title || 'Untitled'}</h5>
                                <p><i class="far fa-calendar"></i> ${recordDate}</p>
                                <p><i class="fas fa-user-md"></i> ${record.doctorName || 'Unknown Doctor'}</p>
                                ${currentUser.role !== 'patient' ? `<p><i class="fas fa-user-injured"></i> Patient: ${patientName}</p>` : ''}
                                <p>${shortDetails}</p>
                            </div>
                            <div style="text-align: right;">
                                <span style="display: inline-block; background: ${record.type === 'progress' ? '#e3f2fd' : '#e8f5e9'}; color: ${record.type === 'progress' ? '#1976d2' : '#388e3c'}; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">
                                    ${record.type === 'progress' ? 'Progress Note' : (record.type || 'Consultation')}
                                </span>
                                <div class="data-table-actions" style="margin-top: 10px;">
                                    <button class="btn btn-outline btn-small" onclick="viewMedicalRecord('${record.id}')">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    ${currentUser.role === 'admin' || currentUser.role === 'doctor' ? `
                                        <button class="btn btn-secondary btn-small" onclick="editMedicalRecord('${record.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
            
            <!-- Pagination -->
            ${totalPages > 1 ? `
                <div class="pagination">
                    <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                            onclick="changePage('medical', ${page - 1})" 
                            ${page <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return `
                            <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                    onclick="changePage('medical', ${pageNum})">
                                ${pageNum}
                            </button>
                        `;
                    }).join('')}
                    
                    <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                            onclick="changePage('medical', ${page + 1})" 
                            ${page >= totalPages ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
}

// Fix showAppointmentsTab function
function showAppointmentsTab() {
    let userAppointments = [];
    let canCreate = false;
    
    if (currentUser.role === 'patient') {
        userAppointments = appointments.filter(a => a.patientUserId === currentUser.id);
        canCreate = true;
    } else if (currentUser.role === 'doctor') {
        userAppointments = appointments.filter(a => a.doctorId === currentUser.id);
        canCreate = true;
    } else if (currentUser.role === 'nurse' || currentUser.role === 'staff') {
        userAppointments = appointments;
        canCreate = true;
    } else if (currentUser.role === 'admin') {
        userAppointments = appointments;
        canCreate = true;
    }
    
    const searchTerm = localStorage.getItem('appointment_search') || '';
    const statusFilter = localStorage.getItem('appointment_status') || '';
    const page = currentPage.appointments || 1;
    
    // Filter appointments
    let filteredAppointments = userAppointments;
    
    if (searchTerm) {
        filteredAppointments = filteredAppointments.filter(a => {
            const searchLower = searchTerm.toLowerCase();
            const appointmentString = `
                ${String(a.patientId || '')} 
                ${a.doctorName || ''} 
                ${a.reason || ''}
            `.toLowerCase();
            return appointmentString.includes(searchLower);
        });
    }
    
    if (statusFilter && statusFilter !== 'all') {
        filteredAppointments = filteredAppointments.filter(a => a.status === statusFilter);
    }
    
    // Calculate pagination
    const totalItems = filteredAppointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-calendar-alt"></i> Appointment Management</h3>
            
            <!-- Patient Selection Dropdown -->
            ${currentUser.role !== 'patient' ? `
                <div class="patient-select-container" style="margin-bottom: 25px;">
                    ${generatePatientDropdown('', true, 'appointmentPatientSelect')}
                </div>
            ` : ''}
            
            <!-- Search and Filter Bar -->
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="appointmentSearch" placeholder="Search appointments..." value="${searchTerm}">
                </div>
                <div class="filter-options">
                    <button class="filter-btn ${!statusFilter || statusFilter === 'all' ? 'active' : ''}" onclick="filterAppointments('all')">All</button>
                    <button class="filter-btn ${statusFilter === 'scheduled' ? 'active' : ''}" onclick="filterAppointments('scheduled')">Scheduled</button>
                    <button class="filter-btn ${statusFilter === 'completed' ? 'active' : ''}" onclick="filterAppointments('completed')">Completed</button>
                    <button class="filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}" onclick="filterAppointments('cancelled')">Cancelled</button>
                </div>
                ${canCreate ? `
                    <button class="btn btn-primary" onclick="openScheduleAppointmentModal()">
                        <i class="fas fa-plus"></i> Schedule Appointment
                    </button>
                ` : ''}
            </div>
            
            <!-- Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Appointments</h5>
                    <div class="value">${filteredAppointments.length}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Scheduled</h5>
                    <div class="value" style="color: var(--warning);">
                        ${filteredAppointments.filter(a => a.status === 'scheduled').length}
                    </div>
                </div>
                <div class="stat-card-small">
                    <h5>Today</h5>
                    <div class="value" style="color: var(--primary);">
                        ${filteredAppointments.filter(a => {
                            const today = new Date().toISOString().split('T')[0];
                            return a.date === today;
                        }).length}
                    </div>
                </div>
                <div class="stat-card-small">
                    <h5>Completion Rate</h5>
                    <div class="value" style="color: var(--success);">
                        ${filteredAppointments.length > 0 ? 
                            Math.round((filteredAppointments.filter(a => a.status === 'completed').length / filteredAppointments.length) * 100) : 0}%
                    </div>
                </div>
            </div>
            
            <!-- Appointments List -->
            <h4><i class="fas fa-list"></i> Appointments (${totalItems})</h4>
            
            ${paginatedAppointments.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <p>No appointments found</p>
                    ${searchTerm ? '<p>Try a different search term</p>' : ''}
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedAppointments.map(appointment => {
                                const patient = patients.find(p => p.id === appointment.patientId);
                                const appointmentDate = appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A';
                                const patientName = patient ? `${patient.firstName} ${patient.lastName}` : (appointment.patientId || 'N/A');
                                
                                return `
                                    <tr>
                                        <td>
                                            <div><strong>${appointmentDate}</strong></div>
                                            <small>${appointment.time || 'N/A'}</small>
                                        </td>
                                        <td>${patientName}</td>
                                        <td>${appointment.doctorName || 'Unknown Doctor'}</td>
                                        <td>
                                            <span style="display: inline-block; padding: 4px 8px; background: #e3f2fd; border-radius: 4px; font-size: 0.85rem;">
                                                ${appointment.type || 'consultation'}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-badge status-${appointment.status || 'scheduled'}">
                                                ${appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : 'Scheduled'}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="data-table-actions">
                                                <button class="btn btn-outline btn-small" onclick="viewAppointmentDetails('${appointment.id}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                ${(currentUser.role === 'admin' || currentUser.role === 'doctor' || currentUser.role === 'nurse' || currentUser.role === 'staff') && appointment.status === 'scheduled' ? `
                                                    <button class="btn btn-secondary btn-small" onclick="editAppointment('${appointment.id}')">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button class="btn btn-success btn-small" onclick="completeAppointment('${appointment.id}')">
                                                        <i class="fas fa-check"></i>
                                                    </button>
                                                    <button class="btn btn-danger btn-small" onclick="cancelAppointment('${appointment.id}')">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                ` : ''}
                                                ${currentUser.role === 'patient' && appointment.status === 'scheduled' ? `
                                                    <button class="btn btn-danger btn-small" onclick="cancelAppointment('${appointment.id}')">
                                                        <i class="fas fa-times"></i> Cancel
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                ${totalPages > 1 ? `
                    <div class="pagination">
                        <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                                onclick="changePage('appointments', ${page - 1})" 
                                ${page <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            if (totalPages <= 5 || (pageNum >= page - 2 && pageNum <= page + 2)) {
                                return `
                                    <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                            onclick="changePage('appointments', ${pageNum})">
                                        ${pageNum}
                                    </button>
                                `;
                            }
                            return '';
                        }).filter(Boolean).join('')}
                        
                        ${totalPages > 5 && page < totalPages - 2 ? `
                            <span class="pagination-btn disabled">...</span>
                            <button class="pagination-btn" onclick="changePage('appointments', ${totalPages})">
                                ${totalPages}
                            </button>
                        ` : ''}
                        
                        <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                                onclick="changePage('appointments', ${page + 1})" 
                                ${page >= totalPages ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            `}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
    
    // Add search event listener
    const searchInput = document.getElementById('appointmentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            localStorage.setItem('appointment_search', searchInput.value);
            currentPage.appointments = 1;
            showAppointmentsTab();
        }, 500));
    }
}
// ======================
// KENYAN PAYMENT SYSTEM FUNCTIONS
// ======================

function openPaymentModal(billId) {
    const bill = billingRecords.find(b => b.id === billId);
    if (!bill) {
        showToast('Error', 'Bill not found', 'error');
        return;
    }
    
    currentBillBeingPaid = bill;
    paymentModalTitle.textContent = 'Make Payment';
    paymentModalSubtitle.textContent = `Invoice: ${bill.invoiceNumber} - KES ${bill.total.toLocaleString()}`;
    
    const patient = patients.find(p => p.id === bill.patientId);
    
    paymentContent.innerHTML = `
        <div class="billing-container">
            <!-- Bill Summary -->
            <div class="bill-summary-card">
                <h4><i class="fas fa-receipt"></i> Bill Summary</h4>
                <div class="summary-item">
                    <span>Patient:</span>
                    <span>${patient ? `${patient.firstName} ${patient.lastName}` : bill.patientId}</span>
                </div>
                <div class="summary-item">
                    <span>Invoice Number:</span>
                    <span>${bill.invoiceNumber}</span>
                </div>
                <div class="summary-item">
                    <span>Date:</span>
                    <span>${new Date(bill.billingDate).toLocaleDateString()}</span>
                </div>
                ${bill.items.map(item => `
                    <div class="summary-item">
                        <span>${item.description}:</span>
                        <span>KES ${item.amount.toLocaleString()}</span>
                    </div>
                `).join('')}
                <div class="summary-item">
                    <span>Subtotal:</span>
                    <span>KES ${bill.subtotal.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <span>Tax (5%):</span>
                    <span>KES ${bill.tax.toLocaleString()}</span>
                </div>
                <div class="summary-item summary-total">
                    <span>Total Amount:</span>
                    <span>KES ${bill.total.toLocaleString()}</span>
                </div>
            </div>
            
            <!-- Payment Methods -->
            <div class="payment-methods">
                <h4><i class="fas fa-credit-card"></i> Select Payment Method</h4>
                <p style="color: var(--gray); margin-bottom: 20px;">Choose your preferred payment method</p>
                
                <div class="payment-options">
                    <div class="payment-option" onclick="selectPaymentMethod('mpesa')">
                        <i class="fas fa-mobile-alt" style="color: #00A859;"></i>
                        <span>M-Pesa</span>
                    </div>
                    <div class="payment-option" onclick="selectPaymentMethod('card')">
                        <i class="fas fa-credit-card" style="color: #0070ba;"></i>
                        <span>Credit/Debit Card</span>
                    </div>
                    <div class="payment-option" onclick="selectPaymentMethod('cash')">
                        <i class="fas fa-money-bill-wave" style="color: #28a745;"></i>
                        <span>Cash</span>
                    </div>
                    <div class="payment-option" onclick="selectPaymentMethod('insurance')">
                        <i class="fas fa-shield-alt" style="color: #ffc107;"></i>
                        <span>Insurance</span>
                    </div>
                </div>
                
                <!-- M-Pesa Payment Form -->
                <div class="mpesa-pin-form" id="mpesaForm">
                    <h5><i class="fas fa-mobile-alt"></i> M-Pesa Payment</h5>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 15px;">
                        Enter your M-Pesa PIN to complete payment of KES ${bill.total.toLocaleString()}
                    </p>
                    <div class="form-group">
                        <label for="mpesaPhone">Phone Number</label>
                        <input type="tel" id="mpesaPhone" placeholder="07XX XXX XXX" value="${patient ? patient.phoneNumber : ''}">
                    </div>
                    <div class="form-group">
                        <label for="mpesaPin">M-Pesa PIN</label>
                        <input type="password" id="mpesaPin" placeholder="Enter your M-Pesa PIN" maxlength="4">
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-success" onclick="processMpesaPayment()" style="width: 100%;">
                            <i class="fas fa-paper-plane"></i> Send Payment Request
                        </button>
                    </div>
                </div>
                
                <!-- Card Payment Form -->
                <div class="mpesa-pin-form" id="cardForm">
                    <h5><i class="fas fa-credit-card"></i> Card Payment</h5>
                    <div class="form-group">
                        <label for="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiryDate">Expiry Date</label>
                            <input type="text" id="expiryDate" placeholder="MM/YY">
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV</label>
                            <input type="password" id="cvv" placeholder="123" maxlength="3">
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-success" onclick="processCardPayment()" style="width: 100%;">
                            <i class="fas fa-lock"></i> Pay Securely
                        </button>
                    </div>
                </div>
                
                <!-- Insurance Form -->
                <div class="mpesa-pin-form" id="insuranceForm">
                    <h5><i class="fas fa-shield-alt"></i> Insurance Claim</h5>
                    <div class="form-group">
                        <label for="insuranceProvider">Insurance Provider</label>
                        <input type="text" id="insuranceProvider" placeholder="e.g., NHIF, AAR, Jubilee" value="${patient ? patient.insuranceProvider : ''}">
                    </div>
                    <div class="form-group">
                        <label for="insuranceNumber">Insurance Number</label>
                        <input type="text" id="insuranceNumber" placeholder="Insurance policy number" value="${patient ? patient.insuranceNumber : ''}">
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-success" onclick="processInsuranceClaim()" style="width: 100%;">
                            <i class="fas fa-paper-plane"></i> Submit Insurance Claim
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Receipt Preview -->
        <div class="receipt" id="receiptPreview">
            <div class="receipt-header">
                <h4><i class="fas fa-hospital-alt"></i> Modern Dynasty Hospital</h4>
                <p>Payment Receipt</p>
            </div>
            <div class="receipt-details">
                <div class="receipt-item">
                    <span>Receipt Number:</span>
                    <span id="receiptNumber">RC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}</span>
                </div>
                <div class="receipt-item">
                    <span>Date:</span>
                    <span>${new Date().toLocaleDateString()}</span>
                </div>
                <div class="receipt-item">
                    <span>Time:</span>
                    <span>${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="receipt-item">
                    <span>Invoice:</span>
                    <span>${bill.invoiceNumber}</span>
                </div>
                <div class="receipt-item">
                    <span>Patient:</span>
                    <span>${patient ? `${patient.firstName} ${patient.lastName}` : bill.patientId}</span>
                </div>
                <div class="receipt-item">
                    <span>Payment Method:</span>
                    <span id="paymentMethodDisplay">-</span>
                </div>
                <div class="receipt-item">
                    <span>Transaction ID:</span>
                    <span id="transactionIdDisplay">-</span>
                </div>
            </div>
            <div class="receipt-total">
                <span>Total Paid:</span>
                <span>KES ${bill.total.toLocaleString()}</span>
            </div>
            <div style="text-align: center; margin-top: 20px; color: var(--gray); font-size: 0.9rem;">
                <p>Thank you for your payment!</p>
                <p>Please keep this receipt for your records.</p>
            </div>
        </div>
    `;
    
    // Hide all payment forms initially
    document.getElementById('mpesaForm').style.display = 'none';
    document.getElementById('cardForm').style.display = 'none';
    document.getElementById('insuranceForm').style.display = 'none';
    document.getElementById('receiptPreview').style.display = 'none';
    processPayment.style.display = 'none';
    
    openModal(paymentModal);
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update UI
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Find and select the clicked option
    const options = document.querySelectorAll('.payment-option');
    for (let option of options) {
        if (option.textContent.includes(method.charAt(0).toUpperCase() + method.slice(1))) {
            option.classList.add('selected');
            break;
        }
    }
    
    // Show appropriate form
    document.getElementById('mpesaForm').style.display = 'none';
    document.getElementById('cardForm').style.display = 'none';
    document.getElementById('insuranceForm').style.display = 'none';
    document.getElementById('receiptPreview').style.display = 'none';
    
    if (method === 'mpesa') {
        document.getElementById('mpesaForm').style.display = 'block';
    } else if (method === 'card') {
        document.getElementById('cardForm').style.display = 'block';
    } else if (method === 'insurance') {
        document.getElementById('insuranceForm').style.display = 'block';
    } else if (method === 'cash') {
        // For cash, show process payment button
        processPayment.style.display = 'block';
        processPayment.onclick = () => processCashPayment();
    }
}

function processMpesaPayment() {
    const phone = document.getElementById('mpesaPhone').value;
    const pin = document.getElementById('mpesaPin').value;
    
    if (!phone || !pin) {
        showToast('Error', 'Please enter phone number and PIN', 'error');
        return;
    }
    
    if (phone.length < 10) {
        showToast('Error', 'Please enter a valid phone number', 'error');
        return;
    }
    
    if (pin.length !== 4) {
        showToast('Error', 'Please enter a valid 4-digit PIN', 'error');
        return;
    }
    
    // Simulate M-Pesa payment processing
    showToast('Processing', 'Sending payment request to M-Pesa...', 'info');
    
    setTimeout(() => {
        const transactionId = `MP${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Update bill status
        dataManager.updateRecord('billing', currentBillBeingPaid.id, {
            status: 'paid',
            paymentMethod: 'mpesa',
            transactionId: transactionId,
            paidAt: new Date().toISOString()
        });
        
        // Show receipt
        showPaymentReceipt('mpesa', transactionId);
        
        showToast('Success', 'Payment completed successfully!', 'success');
    }, 2000);
}

function processCardPayment() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!cardNumber || !expiryDate || !cvv) {
        showToast('Error', 'Please fill all card details', 'error');
        return;
    }
    
    // Simulate card payment processing
    showToast('Processing', 'Processing card payment...', 'info');
    
    setTimeout(() => {
        const transactionId = `CARD${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Update bill status
        dataManager.updateRecord('billing', currentBillBeingPaid.id, {
            status: 'paid',
            paymentMethod: 'card',
            transactionId: transactionId,
            paidAt: new Date().toISOString()
        });
        
        // Show receipt
        showPaymentReceipt('card', transactionId);
        
        showToast('Success', 'Card payment completed successfully!', 'success');
    }, 2000);
}

function processInsuranceClaim() {
    const provider = document.getElementById('insuranceProvider').value;
    const number = document.getElementById('insuranceNumber').value;
    
    if (!provider || !number) {
        showToast('Error', 'Please enter insurance details', 'error');
        return;
    }
    
    // Simulate insurance claim processing
    showToast('Processing', 'Submitting insurance claim...', 'info');
    
    setTimeout(() => {
        const transactionId = `INS${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Update bill status
        dataManager.updateRecord('billing', currentBillBeingPaid.id, {
            status: 'pending_insurance',
            paymentMethod: 'insurance',
            transactionId: transactionId,
            paidAt: new Date().toISOString()
        });
        
        // Show receipt
        showPaymentReceipt('insurance', transactionId);
        
        showToast('Success', 'Insurance claim submitted successfully!', 'success');
    }, 2000);
}

function processCashPayment() {
    // Simulate cash payment
    showToast('Processing', 'Processing cash payment...', 'info');
    
    setTimeout(() => {
        const transactionId = `CASH${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Update bill status
        dataManager.updateRecord('billing', currentBillBeingPaid.id, {
            status: 'paid',
            paymentMethod: 'cash',
            transactionId: transactionId,
            paidAt: new Date().toISOString()
        });
        
        // Show receipt
        showPaymentReceipt('cash', transactionId);
        
        showToast('Success', 'Cash payment recorded successfully!', 'success');
    }, 1500);
}

function showPaymentReceipt(method, transactionId) {
    // Update receipt with payment details
    document.getElementById('paymentMethodDisplay').textContent = 
        method.charAt(0).toUpperCase() + method.slice(1);
    document.getElementById('transactionIdDisplay').textContent = transactionId;
    
    // Show receipt and hide payment forms
    document.getElementById('mpesaForm').style.display = 'none';
    document.getElementById('cardForm').style.display = 'none';
    document.getElementById('insuranceForm').style.display = 'none';
    document.getElementById('receiptPreview').style.display = 'block';
    processPayment.style.display = 'none';
    
    // Change modal title
    paymentModalTitle.textContent = 'Payment Receipt';
    paymentModalSubtitle.textContent = 'Payment completed successfully';
}

// ======================
// ENHANCED UTILITY FUNCTIONS
// ======================
function getRoleDisplayName(role) {
    const roleNames = {
        admin: "Administrator",
        doctor: "Doctor",
        nurse: "Nurse",
        staff: "Staff",
        patient: "Patient",
        pending_approval: "Pending Approval"
    };
    return roleNames[role] || role;
}

function getDashboardTitle(role) {
    const titles = {
        admin: "Hospital Administration Dashboard",
        doctor: "Physician Dashboard",
        nurse: "Nursing Dashboard",
        staff: "Hospital Staff Dashboard",
        patient: "Patient Portal"
    };
    return titles[role] || "Hospital Management Dashboard";
}

function getDashboardSubtitle(role) {
    const subtitles = {
        admin: "Full system access and control",
        doctor: "Clinical access for medical decisions",
        nurse: "Clinical care and implementation",
        staff: "Administrative access for scheduling and billing",
        patient: "Self-service access to personal data"
    };
    return subtitles[role] || "Welcome to your dashboard";
}

function showToast(title, message, type = 'success') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    const icon = toast.querySelector('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        icon.style.color = 'var(--success)';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = 'var(--accent)';
    } else {
        icon.className = 'fas fa-info-circle';
        icon.style.color = 'var(--primary)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentEditRecord = null;
    currentViewRecord = null;
    currentBillBeingPaid = null;
    selectedPaymentMethod = '';
    currentQuickAction = null;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getPendingUsers() {
    return users.filter(user => user.status === 'pending' && user.role === 'pending_approval');
}

function getActiveUsers() {
    return users.filter(user => user.status === 'active' && user.role !== 'pending_approval');
}

function getSuspendedUsers() {
    return users.filter(user => user.status === 'suspended');
}

// ======================
// GLOBAL WINDOW FUNCTIONS
// ======================
window.filterPatients = function(status) {
    localStorage.setItem('patient_status', status);
    currentPage.patients = 1;
    showPatientsTab('patients');
};

window.filterAppointments = function(status) {
    localStorage.setItem('appointment_status', status);
    currentPage.appointments = 1;
    showAppointmentsTab();
};

window.filterBilling = function(status) {
    localStorage.setItem('billing_status', status);
    currentPage.billing = 1;
    showBillingTab();
};

window.filterUsers = function(role) {
    localStorage.setItem('user_role', role);
    currentPage.users = 1;
    showUsersTab();
};

window.changePage = function(type, page) {
    if (page < 1) return;
    currentPage[type] = page;
    
    const activeTab = document.querySelector('.dashboard-tab.active');
    if (activeTab) {
        const tabText = activeTab.textContent.toLowerCase();
        if (tabText.includes('patient') || tabText.includes('records')) {
            if (currentUser.role === 'patient') {
                showPatientPersonalView();
            } else {
                showPatientsTab('patients');
            }
        } else if (tabText.includes('appointment')) {
            showAppointmentsTab();
        } else if (tabText.includes('medical')) {
            showMedicalRecordsTab();
        } else if (tabText.includes('lab')) {
            showLabResultsTab();
        } else if (tabText.includes('medication') || tabText.includes('prescribe')) {
            showMedicationsTab();
        } else if (tabText.includes('billing') || tabText.includes('bill')) {
            showBillingTab();
        } else if (tabText.includes('user')) {
            showUsersTab();
        } else if (tabText.includes('report')) {
            showReportsTab();
        }
    }
};

window.deleteRecord = function(collectionName, recordId, recordName) {
    pendingConfirmation = {
        action: 'delete',
        collection: collectionName,
        id: recordId,
        name: recordName
    };
    
    confirmationTitle.textContent = 'Confirm Delete';
    confirmationMessage.textContent = `Are you sure you want to delete ${recordName}? This action cannot be undone.`;
    
    openModal(confirmationModal);
};

window.approvePendingUser = async function(userId) {
    const roleSelect = document.getElementById(`approveRole_${userId}`);
    const newRole = roleSelect.value;
    
    if (!newRole) {
        showToast('Error', 'Please select a role to approve as', 'error');
        return;
    }
    
    const result = await changeUserRole(userId, newRole, 'Initial approval after registration');
    if (result.success) {
        showToast('Success', result.message, 'success');
        showUsersTab();
    } else {
        showToast('Error', result.message, 'error');
    }
};

window.rejectUser = async function(userId) {
    pendingConfirmation = {
        action: 'reject',
        collection: 'users',
        id: userId,
        name: 'User'
    };
    
    confirmationTitle.textContent = 'Confirm Rejection';
    confirmationMessage.textContent = 'Are you sure you want to reject this user registration? This will delete the user account.';
    
    openModal(confirmationModal);
};

window.suspendUser = async function(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    pendingConfirmation = {
        action: 'suspend',
        collection: 'users',
        id: userId,
        name: `${user.firstName} ${user.lastName}`
    };
    
    confirmationTitle.textContent = 'Confirm Suspension';
    confirmationMessage.textContent = 'Are you sure you want to suspend this user? Please provide a reason:';
    
    // Add reason input
    const reasonInput = document.createElement('textarea');
    reasonInput.id = 'suspensionReason';
    reasonInput.placeholder = 'Enter suspension reason...';
    reasonInput.style.width = '100%';
    reasonInput.style.marginTop = '10px';
    reasonInput.style.padding = '10px';
    reasonInput.style.borderRadius = 'var(--radius)';
    reasonInput.style.border = '1px solid var(--light-gray)';
    
    confirmationMessage.appendChild(document.createElement('br'));
    confirmationMessage.appendChild(reasonInput);
    
    openModal(confirmationModal);
};

window.reactivateUser = async function(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const result = await dataManager.updateRecord('users', userId, {
        status: 'active',
        suspensionReason: null
    });
    
    if (result.success) {
        showToast('Success', `User ${user.firstName} ${user.lastName} has been reactivated.`, 'success');
        showUsersTab();
    } else {
        showToast('Error', 'Failed to reactivate user', 'error');
    }
};

window.deleteUser = async function(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    pendingConfirmation = {
        action: 'delete',
        collection: 'users',
        id: userId,
        name: `${user.firstName} ${user.lastName}`
    };
    
    confirmationTitle.textContent = 'Confirm Delete';
    confirmationMessage.textContent = `Are you sure you want to delete user ${user.firstName} ${user.lastName}? This action cannot be undone.`;
    
    openModal(confirmationModal);
};

window.viewUserDetails = function(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) {
        showToast('Error', 'User not found', 'error');
        return;
    }
    
    currentViewRecord = { type: 'user', id: userId, data: user };
    
    viewModalTitle.textContent = 'User Details';
    viewModalSubtitle.textContent = `${user.firstName} ${user.lastName}`;
    
    const userLogs = roleChangeLogs.filter(log => log.userId === userId);
    
    viewModalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
            <div>
                <h4><i class="fas fa-user"></i> Personal Information</h4>
                <div style="background: var(--light); padding: 20px; border-radius: var(--radius);">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <p><strong>User ID:</strong></p>
                            <p>${user.id.substring(0, 12)}...</p>
                        </div>
                        <div>
                            <p><strong>Name:</strong></p>
                            <p>${user.firstName} ${user.lastName}</p>
                        </div>
                        <div>
                            <p><strong>Email:</strong></p>
                            <p>${user.email}</p>
                        </div>
                        <div>
                            <p><strong>Role:</strong></p>
                            <p><span class="role-badge role-${user.role}">${getRoleDisplayName(user.role)}</span></p>
                        </div>
                        <div>
                            <p><strong>Status:</strong></p>
                            <p><span class="status-badge ${user.status === 'active' ? 'status-active' : user.status === 'pending' ? 'status-pending' : 'status-suspended'}">${user.status}</span></p>
                        </div>
                        ${user.suspensionReason ? `
                            <div style="grid-column: 1 / -1;">
                                <p><strong>Suspension Reason:</strong></p>
                                <p>${user.suspensionReason}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div>
                <h4><i class="fas fa-calendar"></i> Account Information</h4>
                <div style="background: var(--light); padding: 20px; border-radius: var(--radius);">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <p><strong>Created:</strong></p>
                            <p>${new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p><strong>Last Login:</strong></p>
                            <p>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                        </div>
                        ${user.approvedAt ? `
                            <div>
                                <p><strong>Approved:</strong></p>
                                <p>${new Date(user.approvedAt).toLocaleDateString()}</p>
                            </div>
                        ` : ''}
                        ${user.approvedBy ? `
                            <div>
                                <p><strong>Approved By:</strong></p>
                                <p>${users.find(u => u.id === user.approvedBy)?.firstName || 'Unknown'}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            ${userLogs.length > 0 ? `
                <div>
                    <h4><i class="fas fa-history"></i> Role Change History</h4>
                    <div style="background: var(--light); padding: 20px; border-radius: var(--radius); max-height: 300px; overflow-y: auto;">
                        ${userLogs.map(log => `
                            <div style="padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.1);">
                                <div><strong>${new Date(log.timestamp).toLocaleDateString()}</strong></div>
                                <div>Changed from ${getRoleDisplayName(log.fromRole)} to ${getRoleDisplayName(log.toRole)}</div>
                                <div style="font-size: 0.9rem; color: var(--gray);">By: ${log.adminName}</div>
                                ${log.reason ? `<div style="font-size: 0.85rem; color: var(--gray);">Reason: ${log.reason}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${user.lastRoleChange ? `
                <div>
                    <h4><i class="fas fa-exchange-alt"></i> Last Role Change</h4>
                    <div style="background: var(--light); padding: 20px; border-radius: var(--radius);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <p><strong>Date:</strong></p>
                                <p>${new Date(user.lastRoleChange.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p><strong>From:</strong></p>
                                <p>${getRoleDisplayName(user.lastRoleChange.fromRole)}</p>
                            </div>
                            <div>
                                <p><strong>To:</strong></p>
                                <p>${getRoleDisplayName(user.lastRoleChange.toRole)}</p>
                            </div>
                            <div>
                                <p><strong>Changed By:</strong></p>
                                <p>${users.find(u => u.id === user.lastRoleChange.changedBy)?.firstName || 'Unknown'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    openModal(viewModal);
};

window.payBill = function(billId) {
    openPaymentModal(billId);
};

window.markAsPaid = async function(billId) {
    const bill = billingRecords.find(b => b.id === billId);
    if (!bill) {
        showToast('Error', 'Bill not found', 'error');
        return;
    }
    
    const result = await dataManager.updateRecord('billing', billId, {
        status: 'paid',
        paymentMethod: 'manual',
        transactionId: `MAN${Date.now()}`,
        paidAt: new Date().toISOString()
    });
    
    if (result.success) {
        showToast('Success', 'Bill marked as paid successfully', 'success');
        showBillingTab();
    } else {
        showToast('Error', 'Failed to update bill', 'error');
    }
};

// ======================
// CONFIRMATION MODAL HANDLING
// ======================
confirmAction.onclick = async function() {
    if (!pendingConfirmation) return;
    
    const { action, collection, id, name } = pendingConfirmation;
    
    try {
        let result;
        
        switch(action) {
            case 'delete':
                if (collection === 'users') {
                    // For users, we need to check if they have related records
                    const user = users.find(u => u.id === id);
                    if (user && user.role === 'patient') {
                        // Check for patient records
                        const patientRecords = patients.filter(p => p.userId === id);
                        if (patientRecords.length > 0) {
                            showToast('Warning', 'Cannot delete user with patient records. Delete patient records first.', 'error');
                            closeModal(confirmationModal);
                            return;
                        }
                    }
                }
                result = await dataManager.deleteRecord(collection, id);
                break;
            
            case 'reject':
                result = await dataManager.deleteRecord('users', id);
                break;
            
            case 'suspend':
                const reason = document.getElementById('suspensionReason')?.value || 'Violation of terms of service';
                result = await dataManager.updateRecord('users', id, {
                    status: 'suspended',
                    suspensionReason: reason
                });
                break;
        }
        
        if (result && result.success) {
            showToast('Success', `${action.charAt(0).toUpperCase() + action.slice(1)} completed successfully`, 'success');
            
            // Refresh the appropriate tab
            if (collection === 'users') {
                showUsersTab();
            } else if (collection === 'patients') {
                showPatientsTab('patients');
            } else if (collection === 'billing') {
                showBillingTab();
            }
        } else {
            showToast('Error', `Failed to ${action} record`, 'error');
        }
        
    } catch (error) {
        console.error('Confirmation action failed:', error);
        showToast('Error', 'An error occurred', 'error');
    }
    
    closeModal(confirmationModal);
    pendingConfirmation = null;
};

cancelConfirm.onclick = function() {
    closeModal(confirmationModal);
    pendingConfirmation = null;
};

cancelEdit.onclick = function() {
    closeModal(editModal);
};

cancelPayment.onclick = function() {
    closeModal(paymentModal);
};

closeViewModal.onclick = function() {
    closeModal(viewModal);
};

closeReceipt.onclick = function() {
    closeModal(receiptModal);
    // Refresh billing tab after payment
    if (currentBillBeingPaid) {
        showBillingTab();
        currentBillBeingPaid = null;
    }
};

cancelQuickAction.onclick = function() {
    closeModal(quickActionModal);
};

editFromView.onclick = function() {
    if (!currentViewRecord) return;
    
    closeModal(viewModal);
    
    switch(currentViewRecord.type) {
        case 'patient':
            editPatient(currentViewRecord.id);
            break;
        case 'user':
            // Add edit user function
            showToast('Info', 'Edit user functionality coming soon', 'info');
            break;
    }
};

printReceipt.onclick = function() {
    // Simulate print functionality
    const printContent = document.getElementById('receiptPreview').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    showToast('Info', 'Print dialog opened', 'info');
};

// ======================
// ENHANCED LANDING PAGE
// ======================
function initializeLandingPage() {
    // Initialize testimonial slider
    updateTestimonialSlider();
    
    // Initialize feature tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            featureContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Initialize animated counters
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-count'));
        const suffix = stat.textContent.includes('M') ? 'M' : '';
        const increment = target / 100;
        let current = 0;
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        stat.textContent = suffix ? (current / 10).toFixed(1) + suffix : Math.floor(current);
                    }
                }, 20);
                observer.unobserve(stat);
            }
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
    
    // Initialize scroll animations
    const animatedElements = document.querySelectorAll('.section-title, .tab-btn, .stat-card, .feature-card, .calculator-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Initialize section animations
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => sectionObserver.observe(section));
}

// ======================
// TESTIMONIAL SLIDER
// ======================
function updateTestimonialSlider() {
    if (testimonialTrack) {
        testimonialTrack.style.transform = `translateX(-${currentTestimonialSlide * 100}%)`;
    }
}

// ======================
// HEALTH CALCULATORS
// ======================
document.getElementById('calculateBMI')?.addEventListener('click', () => {
    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        showToast('Error', 'Please enter valid height and weight values', 'error');
        return;
    }
    
    const bmi = weight / (height * height);
    const resultDiv = document.getElementById('bmi-result');
    const valueSpan = document.getElementById('bmi-value');
    const categorySpan = document.getElementById('bmi-category');
    const interpretationSpan = document.getElementById('bmi-interpretation');
    
    valueSpan.textContent = bmi.toFixed(1);
    
    let category = '';
    let interpretation = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categorySpan.className = 'result-category category-low';
        interpretation = 'You may need to gain weight. Consult a healthcare professional for guidance.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        categorySpan.className = 'result-category category-normal';
        interpretation = 'Your weight is within the healthy range for your height.';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        categorySpan.className = 'result-category category-high';
        interpretation = 'You may need to lose weight for better health. Regular exercise and a balanced diet are recommended.';
    } else {
        category = 'Obese';
        categorySpan.className = 'result-category category-high';
        interpretation = 'Weight loss is recommended for health improvement. Consult a healthcare professional.';
    }
    
    categorySpan.textContent = category;
    interpretationSpan.textContent = interpretation;
    resultDiv.classList.add('active');
    
    showToast('BMI Calculated', `Your BMI is ${bmi.toFixed(1)} (${category})`, 'success');
});

// ======================
// EVENT LISTENERS
// ======================
authBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchAuthTab('login');
    openModal(authModal);
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
});

closeAuthModal.addEventListener('click', () => {
    closeModal(authModal);
});

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeModal(authModal);
    }
});

loginTab.addEventListener('click', () => switchAuthTab('login'));
registerTab.addEventListener('click', () => switchAuthTab('register'));

// Role selection change listener
userRoleSelect.addEventListener('change', handleRoleSelection);

function handleRoleSelection() {
    const selectedRole = userRoleSelect.value;
    
    roleInfoPatient.style.display = 'none';
    roleInfoProfessional.style.display = 'none';
    
    if (selectedRole === 'patient') {
        roleInfoPatient.style.display = 'block';
    } else if (['doctor', 'nurse', 'staff'].includes(selectedRole)) {
        roleInfoProfessional.style.display = 'block';
    }
}

function switchAuthTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authModalTitle.textContent = "Login to Modern Dynasty";
        authModalSubtitle.textContent = "Access your hospital management dashboard";
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authModalTitle.textContent = "Create Account";
        authModalSubtitle.textContent = "Register for Modern Dynasty Hospital System";
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = loginUser(email, password);
    
    if (result.success) {
        setCurrentUser(result.user);
        closeModal(authModal);
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        showToast('Login Failed', result.message, 'error');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (password !== confirmPassword) {
        showToast('Registration Failed', 'Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Registration Failed', 'Password must be at least 6 characters', 'error');
        return;
    }
    
    if (!role) {
        showToast('Registration Failed', 'Please select a role', 'error');
        return;
    }
    
    const userData = {
        firstName,
        lastName,
        email,
        password,
        role
    };
    
    const result = await registerUser(userData);
    
    if (result.success) {
        if (result.user.role === 'patient') {
            setCurrentUser(result.user);
            closeModal(authModal);
        } else {
            showToast('Registration Submitted', result.message, 'success');
            switchAuthTab('login');
        }
        
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('userRole').value = '';
        roleInfoPatient.style.display = 'none';
        roleInfoProfessional.style.display = 'none';
    } else {
        showToast('Registration Failed', result.message, 'error');
    }
});

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-toggle') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fas fa-bars';
    }
});

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentTestimonialSlide = (currentTestimonialSlide - 1 + 3) % 3;
        updateTestimonialSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonialSlide = (currentTestimonialSlide + 1) % 3;
        updateTestimonialSlider();
    });
}

function logoutUser() {
    currentUser = null;
    
    // Clear user display
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const userRoleBadge = document.getElementById('userRoleBadge');
    
    if (userInfo) {
        userInfo.style.display = 'none';
        userInfo.classList.remove('active');
    }
    if (userName) userName.textContent = '';
    if (userAvatar) userAvatar.textContent = '';
    if (userRoleBadge) userRoleBadge.textContent = '';
    
    // Reset auth UI
    document.getElementById('authBtn').style.display = 'flex';
    document.getElementById('logoutBtn').style.display = 'none';
    document.querySelector('.dashboard-nav').style.display = 'none';
    document.getElementById('dashboard').classList.remove('active');
    
    localStorage.removeItem('mdhms_current_user');
    showToast('Logged Out', 'You have been successfully logged out.', 'success');
}

// ======================
// INITIALIZATION
// ======================
// Update the initialization
window.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 Modern Dynasty Hospital Management System Initializing...");
    
    // Clear any default user display
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const userRoleBadge = document.getElementById('userRoleBadge');
    
    if (userInfo) userInfo.style.display = 'none';
    if (userName) userName.textContent = '';
    if (userAvatar) userAvatar.textContent = '';
    if (userRoleBadge) userRoleBadge.textContent = '';
    
    try {
        // Initialize Firebase (optional - will use localStorage if fails)
        await initializeFirebase();
    } catch (error) {
        console.warn("Firebase initialization failed, using localStorage:", error);
        firebaseInitialized = false;
    }
    
    try {
        // Initialize Data Manager
        dataManager = new DataManager();
        
        // Check and create admin user if needed
        checkAdminUser();
        
        // Initialize landing page features
        if (typeof initializeLandingPage === 'function') {
            initializeLandingPage();
        }
        
        // Show hero section immediately
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.classList.add('visible');
        }
        
        // Check for saved user
        const savedUser = localStorage.getItem('mdhms_current_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (user && user.id) {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error("Error parsing saved user:", error);
                localStorage.removeItem('mdhms_current_user');
            }
        }
        
        // Auto slide testimonials
        if (testimonialTrack) {
            setInterval(() => {
                currentTestimonialSlide = (currentTestimonialSlide + 1) % 3;
                updateTestimonialSlider();
            }, 5000);
        }
        
        console.log("✅ System initialization complete");
        console.log("📊 Data loaded successfully");
        console.log("👤 Users:", users.length);
        console.log("👨‍⚕️ Patients:", patients.length);
        console.log("📅 Appointments:", appointments.length);
        
    } catch (error) {
        console.error("❌ System initialization failed:", error);
        showToast('Error', 'System initialization failed. Please refresh the page.', 'error');
    }
});
// ======================
// VIEW/EDIT FUNCTIONS
// ======================

// Patient Functions
function viewPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        showToast('Error', 'Patient not found', 'error');
        return;
    }
    
    currentViewRecord = { type: 'patient', id: patientId, data: patient };
    
    viewModalTitle.textContent = 'Patient Details';
    viewModalSubtitle.textContent = `${patient.firstName} ${patient.lastName} (${patient.id})`;
    
    const patientAppointments = appointments.filter(a => a.patientId === patientId);
    const patientMedications = medications.filter(m => m.patientId === patientId);
    const patientBills = billingRecords.filter(b => b.patientId === patientId);
    const patientLabResults = labResults.filter(l => l.patientId === patientId);
    const patientMedicalRecords = medicalRecords.filter(m => m.patientId === patientId);
    
    viewModalBody.innerHTML = `
        <div class="patient-details-container">
            <!-- Personal Information -->
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> Personal Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Patient ID:</span>
                        <span class="detail-value">${patient.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Full Name:</span>
                        <span class="detail-value">${patient.firstName} ${patient.lastName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date of Birth:</span>
                        <span class="detail-value">${patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Age:</span>
                        <span class="detail-value">${patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gender:</span>
                        <span class="detail-value">${patient.gender || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Blood Group:</span>
                        <span class="detail-value">${patient.bloodGroup || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">National ID:</span>
                        <span class="detail-value">${patient.nationalId || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <!-- Contact Information -->
            <div class="detail-section">
                <h4><i class="fas fa-address-book"></i> Contact Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${patient.email || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${patient.phoneNumber || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address:</span>
                        <span class="detail-value">${patient.address || 'N/A'}</span>
                    </div>
                    ${patient.emergencyContact ? `
                        <div class="detail-item">
                            <span class="detail-label">Emergency Contact:</span>
                            <span class="detail-value">${patient.emergencyContact.name} (${patient.emergencyContact.relationship})</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Emergency Phone:</span>
                            <span class="detail-value">${patient.emergencyContact.phone}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Medical Information -->
            <div class="detail-section">
                <h4><i class="fas fa-heartbeat"></i> Medical Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Insurance Provider:</span>
                        <span class="detail-value">${patient.insuranceProvider || 'None'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Insurance Number:</span>
                        <span class="detail-value">${patient.insuranceNumber || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Allergies:</span>
                        <span class="detail-value">${patient.allergies && patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Chronic Conditions:</span>
                        <span class="detail-value">${patient.chronicConditions && patient.chronicConditions.length > 0 ? patient.chronicConditions.join(', ') : 'None'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="status-badge ${patient.status === 'active' ? 'status-active' : 'status-suspended'}">
                                ${patient.status}
                            </span>
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Visit:</span>
                        <span class="detail-value">${patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="detail-stats">
                <div class="detail-stat">
                    <div class="stat-label">Appointments</div>
                    <div class="stat-value">${patientAppointments.length}</div>
                </div>
                <div class="detail-stat">
                    <div class="stat-label">Medications</div>
                    <div class="stat-value">${patientMedications.length}</div>
                </div>
                <div class="detail-stat">
                    <div class="stat-label">Lab Results</div>
                    <div class="stat-value">${patientLabResults.length}</div>
                </div>
                <div class="detail-stat">
                    <div class="stat-label">Medical Records</div>
                    <div class="stat-value">${patientMedicalRecords.length}</div>
                </div>
                <div class="detail-stat">
                    <div class="stat-label">Bills</div>
                    <div class="stat-value">${patientBills.length}</div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="scheduleAppointmentForPatient('${patientId}')">
                    <i class="fas fa-calendar-plus"></i> Schedule Appointment
                </button>
                <button class="btn btn-secondary" onclick="prescribeForPatient('${patientId}')">
                    <i class="fas fa-prescription"></i> Prescribe Medication
                </button>
                <button class="btn btn-success" onclick="addLabResultForPatient('${patientId}')">
                    <i class="fas fa-flask"></i> Add Lab Result
                </button>
                ${currentUser.role === 'admin' || currentUser.role === 'staff' ? `
                    <button class="btn btn-warning" onclick="createInvoiceForPatient('${patientId}')">
                        <i class="fas fa-file-invoice"></i> Create Invoice
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    openModal(viewModal);
}

function editPatient(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        showToast('Error', 'Patient not found', 'error');
        return;
    }
    
    currentEditRecord = { type: 'patient', id: patientId, data: patient };
    
    editModalTitle.textContent = 'Edit Patient';
    editModalSubtitle.textContent = `${patient.firstName} ${patient.lastName}`;
    
    editForm.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="editFirstName"><i class="fas fa-user"></i> First Name *</label>
                <input type="text" id="editFirstName" class="form-control" value="${patient.firstName}" required>
            </div>
            <div class="form-group">
                <label for="editLastName"><i class="fas fa-user"></i> Last Name *</label>
                <input type="text" id="editLastName" class="form-control" value="${patient.lastName}" required>
            </div>
            <div class="form-group">
                <label for="editEmail"><i class="fas fa-envelope"></i> Email</label>
                <input type="email" id="editEmail" class="form-control" value="${patient.email || ''}">
            </div>
            <div class="form-group">
                <label for="editPhone"><i class="fas fa-phone"></i> Phone Number *</label>
                <input type="tel" id="editPhone" class="form-control" value="${patient.phoneNumber || ''}" required>
            </div>
            <div class="form-group">
                <label for="editNationalId"><i class="fas fa-id-card"></i> National ID</label>
                <input type="text" id="editNationalId" class="form-control" value="${patient.nationalId || ''}">
            </div>
            <div class="form-group">
                <label for="editDateOfBirth"><i class="fas fa-birthday-cake"></i> Date of Birth</label>
                <input type="date" id="editDateOfBirth" class="form-control" value="${patient.dateOfBirth || ''}">
            </div>
            <div class="form-group">
                <label for="editGender"><i class="fas fa-venus-mars"></i> Gender</label>
                <select id="editGender" class="form-control">
                    <option value="">Select Gender</option>
                    <option value="male" ${patient.gender === 'male' ? 'selected' : ''}>Male</option>
                    <option value="female" ${patient.gender === 'female' ? 'selected' : ''}>Female</option>
                    <option value="other" ${patient.gender === 'other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editBloodGroup"><i class="fas fa-tint"></i> Blood Group</label>
                <select id="editBloodGroup" class="form-control">
                    <option value="">Select Blood Group</option>
                    <option value="A+" ${patient.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                    <option value="A-" ${patient.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                    <option value="B+" ${patient.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                    <option value="B-" ${patient.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                    <option value="O+" ${patient.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                    <option value="O-" ${patient.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                    <option value="AB+" ${patient.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                    <option value="AB-" ${patient.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label for="editAddress"><i class="fas fa-home"></i> Address</label>
                <input type="text" id="editAddress" class="form-control" value="${patient.address || ''}">
            </div>
            <div class="form-group">
                <label for="editInsuranceProvider"><i class="fas fa-shield-alt"></i> Insurance Provider</label>
                <select id="editInsuranceProvider" class="form-control">
                    <option value="None" ${patient.insuranceProvider === 'None' ? 'selected' : ''}>None</option>
                    <option value="NHIF" ${patient.insuranceProvider === 'NHIF' ? 'selected' : ''}>NHIF</option>
                    <option value="AAR Healthcare" ${patient.insuranceProvider === 'AAR Healthcare' ? 'selected' : ''}>AAR Healthcare</option>
                    <option value="Jubilee Insurance" ${patient.insuranceProvider === 'Jubilee Insurance' ? 'selected' : ''}>Jubilee Insurance</option>
                    <option value="Other" ${patient.insuranceProvider && !['None', 'NHIF', 'AAR Healthcare', 'Jubilee Insurance'].includes(patient.insuranceProvider) ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editInsuranceNumber"><i class="fas fa-id-card-alt"></i> Insurance Number</label>
                <input type="text" id="editInsuranceNumber" class="form-control" value="${patient.insuranceNumber || ''}">
            </div>
        </div>
        
        <div class="form-group">
            <label for="editAllergies"><i class="fas fa-allergies"></i> Allergies</label>
            <input type="text" id="editAllergies" class="form-control" value="${patient.allergies ? patient.allergies.join(', ') : ''}" placeholder="Separate with commas">
        </div>
        
        <div class="form-group">
            <label for="editChronicConditions"><i class="fas fa-heartbeat"></i> Chronic Conditions</label>
            <input type="text" id="editChronicConditions" class="form-control" value="${patient.chronicConditions ? patient.chronicConditions.join(', ') : ''}" placeholder="Separate with commas">
        </div>
        
        <div class="form-group">
            <label for="editStatus"><i class="fas fa-toggle-on"></i> Status</label>
            <select id="editStatus" class="form-control">
                <option value="active" ${patient.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="inactive" ${patient.status === 'inactive' ? 'selected' : ''}>Inactive</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="editNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="editNotes" class="form-control" rows="3">${patient.notes || ''}</textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Update Patient';
    executeQuickAction.onclick = updatePatient;
    
    openModal(editModal);
}

async function updatePatient() {
    const patientData = {
        firstName: document.getElementById('editFirstName').value.trim(),
        lastName: document.getElementById('editLastName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phoneNumber: document.getElementById('editPhone').value.trim(),
        nationalId: document.getElementById('editNationalId').value.trim(),
        dateOfBirth: document.getElementById('editDateOfBirth').value,
        gender: document.getElementById('editGender').value,
        bloodGroup: document.getElementById('editBloodGroup').value,
        address: document.getElementById('editAddress').value.trim(),
        insuranceProvider: document.getElementById('editInsuranceProvider').value,
        insuranceNumber: document.getElementById('editInsuranceNumber').value.trim(),
        allergies: document.getElementById('editAllergies').value.split(',').map(a => a.trim()).filter(a => a),
        chronicConditions: document.getElementById('editChronicConditions').value.split(',').map(c => c.trim()).filter(c => c),
        status: document.getElementById('editStatus').value,
        notes: document.getElementById('editNotes').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!patientData.firstName || !patientData.lastName || !patientData.phoneNumber) {
        showToast('Error', 'Please fill all required fields', 'error');
        return;
    }
    
    try {
        const result = await dataManager.updateRecord('patients', currentEditRecord.id, patientData);
        if (result.success) {
            showToast('Success', 'Patient updated successfully!', 'success');
            closeModal(editModal);
            showPatientsTab('patients');
        } else {
            showToast('Error', 'Failed to update patient', 'error');
        }
    } catch (error) {
        console.error('Error updating patient:', error);
        showToast('Error', 'Failed to update patient', 'error');
    }
}

// Helper functions for patient actions
function scheduleAppointmentForPatient(patientId) {
    closeModal(viewModal);
    openScheduleAppointmentModal();
    // Pre-select the patient in the appointment modal
    setTimeout(() => {
        const select = document.getElementById('appointmentPatientQuick');
        if (select) {
            select.value = patientId;
        }
    }, 100);
}

function prescribeForPatient(patientId) {
    closeModal(viewModal);
    openPrescribeMedicationModal();
    setTimeout(() => {
        const select = document.getElementById('medicationPatientQuick');
        if (select) {
            select.value = patientId;
        }
    }, 100);
}

function addLabResultForPatient(patientId) {
    closeModal(viewModal);
    openAddLabResultModal();
    setTimeout(() => {
        const select = document.getElementById('labResultPatientQuick');
        if (select) {
            select.value = patientId;
        }
    }, 100);
}

function createInvoiceForPatient(patientId) {
    closeModal(viewModal);
    openCreateInvoiceModal();
    setTimeout(() => {
        const select = document.getElementById('invoicePatientQuick');
        if (select) {
            select.value = patientId;
        }
    }, 100);
}

// Appointment Functions
function viewAppointmentDetails(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) {
        showToast('Error', 'Appointment not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === appointment.patientId);
    const doctor = users.find(u => u.id === appointment.doctorId);
    
    viewModalTitle.textContent = 'Appointment Details';
    viewModalSubtitle.textContent = `Appointment with ${appointment.doctorName}`;
    
    viewModalBody.innerHTML = `
        <div class="appointment-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${appointment.time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${appointment.duration} minutes</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge status-${appointment.status}">
                            ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${appointment.location}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-injured"></i> Patient Information</h4>
                <div class="detail-item">
                    <span class="detail-label">Patient:</span>
                    <span class="detail-value">${patient ? `${patient.firstName} ${patient.lastName}` : appointment.patientId}</span>
                </div>
                ${patient?.phoneNumber ? `
                    <div class="detail-item">
                        <span class="detail-label">Contact:</span>
                        <span class="detail-value">${patient.phoneNumber}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-md"></i> Doctor Information</h4>
                <div class="detail-item">
                    <span class="detail-label">Doctor:</span>
                    <span class="detail-value">${appointment.doctorName}</span>
                </div>
                ${doctor?.specialty ? `
                    <div class="detail-item">
                        <span class="detail-label">Specialty:</span>
                        <span class="detail-value">${doctor.specialty}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-comment-medical"></i> Reason & Notes</h4>
                <div class="detail-item">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value">${appointment.reason}</span>
                </div>
                ${appointment.notes ? `
                    <div class="detail-item">
                        <span class="detail-label">Notes:</span>
                        <span class="detail-value">${appointment.notes}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Additional Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Created:</span>
                        <span class="detail-value">${new Date(appointment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated:</span>
                        <span class="detail-value">${new Date(appointment.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Created By:</span>
                        <span class="detail-value">${users.find(u => u.id === appointment.createdBy)?.firstName || 'System'}</span>
                    </div>
                </div>
            </div>
            
            ${appointment.status === 'scheduled' ? `
                <div class="detail-actions">
                    ${currentUser.role === 'patient' ? `
                        <button class="btn btn-danger" onclick="cancelAppointment('${appointmentId}')">
                            <i class="fas fa-times"></i> Cancel Appointment
                        </button>
                        <button class="btn btn-secondary" onclick="rescheduleAppointment('${appointmentId}')">
                            <i class="fas fa-clock"></i> Reschedule
                        </button>
                    ` : ''}
                    ${currentUser.role === 'doctor' || currentUser.role === 'admin' || currentUser.role === 'staff' ? `
                        <button class="btn btn-success" onclick="completeAppointment('${appointmentId}')">
                            <i class="fas fa-check"></i> Mark as Complete
                        </button>
                        <button class="btn btn-danger" onclick="cancelAppointment('${appointmentId}')">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button class="btn btn-secondary" onclick="editAppointment('${appointmentId}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `;
    
    openModal(viewModal);
}

function editAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) {
        showToast('Error', 'Appointment not found', 'error');
        return;
    }
    
    currentEditRecord = { type: 'appointment', id: appointmentId, data: appointment };
    
    editModalTitle.textContent = 'Edit Appointment';
    editModalSubtitle.textContent = `Edit appointment for ${new Date(appointment.date).toLocaleDateString()}`;
    
    const doctors = users.filter(u => u.role === 'doctor' && u.status === 'active');
    
    editForm.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="editAppointmentDate"><i class="fas fa-calendar"></i> Date</label>
                <input type="date" id="editAppointmentDate" class="form-control" value="${appointment.date}">
            </div>
            <div class="form-group">
                <label for="editAppointmentTime"><i class="fas fa-clock"></i> Time</label>
                <select id="editAppointmentTime" class="form-control">
                    <option value="09:00" ${appointment.time === '09:00' ? 'selected' : ''}>09:00 AM</option>
                    <option value="10:00" ${appointment.time === '10:00' ? 'selected' : ''}>10:00 AM</option>
                    <option value="11:00" ${appointment.time === '11:00' ? 'selected' : ''}>11:00 AM</option>
                    <option value="12:00" ${appointment.time === '12:00' ? 'selected' : ''}>12:00 PM</option>
                    <option value="14:00" ${appointment.time === '14:00' ? 'selected' : ''}>02:00 PM</option>
                    <option value="15:00" ${appointment.time === '15:00' ? 'selected' : ''}>03:00 PM</option>
                    <option value="16:00" ${appointment.time === '16:00' ? 'selected' : ''}>04:00 PM</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editAppointmentDuration"><i class="fas fa-hourglass-half"></i> Duration</label>
                <select id="editAppointmentDuration" class="form-control">
                    <option value="30" ${appointment.duration === 30 ? 'selected' : ''}>30 minutes</option>
                    <option value="45" ${appointment.duration === 45 ? 'selected' : ''}>45 minutes</option>
                    <option value="60" ${appointment.duration === 60 ? 'selected' : ''}>1 hour</option>
                    <option value="90" ${appointment.duration === 90 ? 'selected' : ''}>1.5 hours</option>
                    <option value="120" ${appointment.duration === 120 ? 'selected' : ''}>2 hours</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editAppointmentType"><i class="fas fa-stethoscope"></i> Type</label>
                <select id="editAppointmentType" class="form-control">
                    <option value="consultation" ${appointment.type === 'consultation' ? 'selected' : ''}>Consultation</option>
                    <option value="checkup" ${appointment.type === 'checkup' ? 'selected' : ''}>Check-up</option>
                    <option value="followup" ${appointment.type === 'followup' ? 'selected' : ''}>Follow-up</option>
                    <option value="emergency" ${appointment.type === 'emergency' ? 'selected' : ''}>Emergency</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editAppointmentDoctor"><i class="fas fa-user-md"></i> Doctor</label>
                <select id="editAppointmentDoctor" class="form-control">
                    ${doctors.map(doctor => `
                        <option value="${doctor.id}" ${appointment.doctorId === doctor.id ? 'selected' : ''}>
                            Dr. ${doctor.firstName} ${doctor.lastName}
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="editAppointmentLocation"><i class="fas fa-map-marker-alt"></i> Location</label>
                <select id="editAppointmentLocation" class="form-control">
                    <option value="Consultation Room 1" ${appointment.location === 'Consultation Room 1' ? 'selected' : ''}>Consultation Room 1</option>
                    <option value="Consultation Room 2" ${appointment.location === 'Consultation Room 2' ? 'selected' : ''}>Consultation Room 2</option>
                    <option value="Consultation Room 3" ${appointment.location === 'Consultation Room 3' ? 'selected' : ''}>Consultation Room 3</option>
                    <option value="Emergency Room" ${appointment.location === 'Emergency Room' ? 'selected' : ''}>Emergency Room</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <label for="editAppointmentReason"><i class="fas fa-comment-medical"></i> Reason</label>
            <textarea id="editAppointmentReason" class="form-control" rows="3">${appointment.reason}</textarea>
        </div>
        
        <div class="form-group">
            <label for="editAppointmentNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="editAppointmentNotes" class="form-control" rows="2">${appointment.notes || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label for="editAppointmentStatus"><i class="fas fa-toggle-on"></i> Status</label>
            <select id="editAppointmentStatus" class="form-control">
                <option value="scheduled" ${appointment.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="completed" ${appointment.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="cancelled" ${appointment.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
        </div>
    `;
    
    executeQuickAction.textContent = 'Update Appointment';
    executeQuickAction.onclick = updateAppointment;
    
    openModal(editModal);
}

async function updateAppointment() {
    const appointmentData = {
        date: document.getElementById('editAppointmentDate').value,
        time: document.getElementById('editAppointmentTime').value,
        duration: parseInt(document.getElementById('editAppointmentDuration').value),
        type: document.getElementById('editAppointmentType').value,
        doctorId: document.getElementById('editAppointmentDoctor').value,
        location: document.getElementById('editAppointmentLocation').value,
        reason: document.getElementById('editAppointmentReason').value.trim(),
        notes: document.getElementById('editAppointmentNotes').value.trim(),
        status: document.getElementById('editAppointmentStatus').value,
        updatedAt: new Date().toISOString()
    };
    
    // Update doctor name
    const doctor = users.find(u => u.id === appointmentData.doctorId);
    appointmentData.doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
    
    try {
        const result = await dataManager.updateRecord('appointments', currentEditRecord.id, appointmentData);
        if (result.success) {
            showToast('Success', 'Appointment updated successfully!', 'success');
            closeModal(editModal);
            showAppointmentsTab();
        } else {
            showToast('Error', 'Failed to update appointment', 'error');
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        showToast('Error', 'Failed to update appointment', 'error');
    }
}

async function completeAppointment(appointmentId) {
    try {
        const result = await dataManager.updateRecord('appointments', appointmentId, {
            status: 'completed',
            updatedAt: new Date().toISOString()
        });
        
        if (result.success) {
            showToast('Success', 'Appointment marked as completed', 'success');
            closeModal(viewModal);
            showAppointmentsTab();
        } else {
            showToast('Error', 'Failed to complete appointment', 'error');
        }
    } catch (error) {
        console.error('Error completing appointment:', error);
        showToast('Error', 'Failed to complete appointment', 'error');
    }
}

async function cancelAppointment(appointmentId) {
    pendingConfirmation = {
        action: 'cancel',
        collection: 'appointments',
        id: appointmentId,
        name: 'Appointment'
    };
    
    confirmationTitle.textContent = 'Cancel Appointment';
    confirmationMessage.textContent = 'Are you sure you want to cancel this appointment?';
    
    openModal(confirmationModal);
}

function rescheduleAppointment(appointmentId) {
    closeModal(viewModal);
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
        editAppointment(appointmentId);
    }
}

// Medical Record Functions
function viewMedicalRecord(recordId) {
    const record = medicalRecords.find(r => r.id === recordId);
    if (!record) {
        showToast('Error', 'Medical record not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === record.patientId);
    const doctor = users.find(u => u.id === record.doctorId);
    
    viewModalTitle.textContent = 'Medical Record';
    viewModalSubtitle.textContent = record.title;
    
    viewModalBody.innerHTML = `
        <div class="medical-record-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${record.type.charAt(0).toUpperCase() + record.type.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Patient:</span>
                    <span class="detail-value">${patient ? `${patient.firstName} ${patient.lastName}` : record.patientId}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Doctor:</span>
                    <span class="detail-value">${record.doctorName}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-file-alt"></i> Details</h4>
                <div class="detail-content">
                    ${record.details.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            ${record.diagnosis ? `
                <div class="detail-section">
                    <h4><i class="fas fa-stethoscope"></i> Diagnosis</h4>
                    <div class="detail-content">
                        ${record.diagnosis}
                    </div>
                </div>
            ` : ''}
            
            ${record.treatment ? `
                <div class="detail-section">
                    <h4><i class="fas fa-prescription"></i> Treatment/Plan</h4>
                    <div class="detail-content">
                        ${record.treatment}
                    </div>
                </div>
            ` : ''}
            
            ${record.vitalSigns && (record.vitalSigns.bloodPressure || record.vitalSigns.heartRate || record.vitalSigns.temperature || record.vitalSigns.weight) ? `
                <div class="detail-section">
                    <h4><i class="fas fa-heartbeat"></i> Vital Signs</h4>
                    <div class="detail-grid">
                        ${record.vitalSigns.bloodPressure ? `
                            <div class="detail-item">
                                <span class="detail-label">Blood Pressure:</span>
                                <span class="detail-value">${record.vitalSigns.bloodPressure}</span>
                            </div>
                        ` : ''}
                        ${record.vitalSigns.heartRate ? `
                            <div class="detail-item">
                                <span class="detail-label">Heart Rate:</span>
                                <span class="detail-value">${record.vitalSigns.heartRate}</span>
                            </div>
                        ` : ''}
                        ${record.vitalSigns.temperature ? `
                            <div class="detail-item">
                                <span class="detail-label">Temperature:</span>
                                <span class="detail-value">${record.vitalSigns.temperature}</span>
                            </div>
                        ` : ''}
                        ${record.vitalSigns.weight ? `
                            <div class="detail-item">
                                <span class="detail-label">Weight:</span>
                                <span class="detail-value">${record.vitalSigns.weight}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${record.followUpDate ? `
                <div class="detail-section">
                    <h4><i class="fas fa-calendar-plus"></i> Follow-up</h4>
                    <div class="detail-item">
                        <span class="detail-label">Follow-up Date:</span>
                        <span class="detail-value">${new Date(record.followUpDate).toLocaleDateString()}</span>
                    </div>
                </div>
            ` : ''}
            
            ${record.notes ? `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> Additional Notes</h4>
                    <div class="detail-content">
                        ${record.notes}
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Record Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Created:</span>
                        <span class="detail-value">${new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated:</span>
                        <span class="detail-value">${new Date(record.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Created By:</span>
                        <span class="detail-value">${users.find(u => u.id === record.createdBy)?.firstName || 'System'}</span>
                    </div>
                </div>
            </div>
            
            ${currentUser.role === 'admin' || currentUser.role === 'doctor' ? `
                <div class="detail-actions">
                    <button class="btn btn-secondary" onclick="editMedicalRecord('${recordId}')">
                        <i class="fas fa-edit"></i> Edit Record
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    openModal(viewModal);
}

function editMedicalRecord(recordId) {
    const record = medicalRecords.find(r => r.id === recordId);
    if (!record) {
        showToast('Error', 'Medical record not found', 'error');
        return;
    }
    
    currentEditRecord = { type: 'medical_record', id: recordId, data: record };
    
    editModalTitle.textContent = 'Edit Medical Record';
    editModalSubtitle.textContent = record.title;
    
    editForm.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="editRecordDate"><i class="fas fa-calendar"></i> Date</label>
                <input type="date" id="editRecordDate" class="form-control" value="${record.date}">
            </div>
            <div class="form-group">
                <label for="editRecordType"><i class="fas fa-file-medical"></i> Type</label>
                <select id="editRecordType" class="form-control">
                    <option value="progress" ${record.type === 'progress' ? 'selected' : ''}>Progress Note</option>
                    <option value="consultation" ${record.type === 'consultation' ? 'selected' : ''}>Consultation</option>
                    <option value="procedure" ${record.type === 'procedure' ? 'selected' : ''}>Procedure</option>
                    <option value="diagnosis" ${record.type === 'diagnosis' ? 'selected' : ''}>Diagnosis</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editRecordTitle"><i class="fas fa-heading"></i> Title</label>
                <input type="text" id="editRecordTitle" class="form-control" value="${record.title}">
            </div>
        </div>
        
        <div class="form-group">
            <label for="editRecordDetails"><i class="fas fa-file-alt"></i> Details</label>
            <textarea id="editRecordDetails" class="form-control" rows="4">${record.details}</textarea>
        </div>
        
        <div class="form-group">
            <label for="editRecordDiagnosis"><i class="fas fa-stethoscope"></i> Diagnosis</label>
            <input type="text" id="editRecordDiagnosis" class="form-control" value="${record.diagnosis || ''}">
        </div>
        
        <div class="form-group">
            <label for="editRecordTreatment"><i class="fas fa-prescription"></i> Treatment/Plan</label>
            <textarea id="editRecordTreatment" class="form-control" rows="2">${record.treatment || ''}</textarea>
        </div>
        
        <div class="form-grid">
            <div class="form-group">
                <label for="editRecordBP">Blood Pressure</label>
                <input type="text" id="editRecordBP" class="form-control" value="${record.vitalSigns?.bloodPressure || ''}">
            </div>
            <div class="form-group">
                <label for="editRecordHR">Heart Rate</label>
                <input type="text" id="editRecordHR" class="form-control" value="${record.vitalSigns?.heartRate || ''}">
            </div>
            <div class="form-group">
                <label for="editRecordTemp">Temperature</label>
                <input type="text" id="editRecordTemp" class="form-control" value="${record.vitalSigns?.temperature || ''}">
            </div>
            <div class="form-group">
                <label for="editRecordWeight">Weight</label>
                <input type="text" id="editRecordWeight" class="form-control" value="${record.vitalSigns?.weight || ''}">
            </div>
        </div>
        
        <div class="form-group">
            <label for="editRecordFollowUp"><i class="fas fa-calendar-plus"></i> Follow-up Date</label>
            <input type="date" id="editRecordFollowUp" class="form-control" value="${record.followUpDate || ''}">
        </div>
        
        <div class="form-group">
            <label for="editRecordNotes"><i class="fas fa-sticky-note"></i> Additional Notes</label>
            <textarea id="editRecordNotes" class="form-control" rows="2">${record.notes || ''}</textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Update Medical Record';
    executeQuickAction.onclick = updateMedicalRecord;
    
    openModal(editModal);
}

async function updateMedicalRecord() {
    const recordData = {
        date: document.getElementById('editRecordDate').value,
        type: document.getElementById('editRecordType').value,
        title: document.getElementById('editRecordTitle').value.trim(),
        details: document.getElementById('editRecordDetails').value.trim(),
        diagnosis: document.getElementById('editRecordDiagnosis').value.trim(),
        treatment: document.getElementById('editRecordTreatment').value.trim(),
        vitalSigns: {
            bloodPressure: document.getElementById('editRecordBP').value.trim(),
            heartRate: document.getElementById('editRecordHR').value.trim(),
            temperature: document.getElementById('editRecordTemp').value.trim(),
            weight: document.getElementById('editRecordWeight').value.trim()
        },
        followUpDate: document.getElementById('editRecordFollowUp').value,
        notes: document.getElementById('editRecordNotes').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    try {
        const result = await dataManager.updateRecord('medicalRecords', currentEditRecord.id, recordData);
        if (result.success) {
            showToast('Success', 'Medical record updated successfully!', 'success');
            closeModal(editModal);
            showMedicalRecordsTab();
        } else {
            showToast('Error', 'Failed to update medical record', 'error');
        }
    } catch (error) {
        console.error('Error updating medical record:', error);
        showToast('Error', 'Failed to update medical record', 'error');
    }
}

// Lab Result Functions
function viewLabResult(resultId) {
    const result = labResults.find(l => l.id === resultId);
    if (!result) {
        showToast('Error', 'Lab result not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === result.patientId);
    const doctor = users.find(u => u.id === result.reviewedBy);
    const uploader = users.find(u => u.id === result.uploadedBy);
    
    viewModalTitle.textContent = 'Laboratory Result';
    viewModalSubtitle.textContent = result.testName;
    
    viewModalBody.innerHTML = `
        <div class="lab-result-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Test Date:</span>
                    <span class="detail-value">${new Date(result.testDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Test Type:</span>
                    <span class="detail-value">${result.testType.charAt(0).toUpperCase() + result.testType.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge ${result.status === 'completed' ? 'status-active' : result.status === 'pending' ? 'status-pending' : 'status-suspended'}">
                            ${result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                        </span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Patient:</span>
                    <span class="detail-value">${patient ? `${patient.firstName} ${patient.lastName}` : result.patientId}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-file-medical-alt"></i> Results</h4>
                <div class="detail-content">
                    ${result.result.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            ${result.notes ? `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                    <div class="detail-content">
                        ${result.notes}
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Additional Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Created:</span>
                        <span class="detail-value">${new Date(result.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated:</span>
                        <span class="detail-value">${new Date(result.updatedAt).toLocaleDateString()}</span>
                    </div>
                    ${result.reviewedBy ? `
                        <div class="detail-item">
                            <span class="detail-label">Reviewed By:</span>
                            <span class="detail-value">${doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown'}</span>
                        </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label">Uploaded By:</span>
                        <span class="detail-value">${uploader ? uploader.firstName : 'Unknown'}</span>
                    </div>
                </div>
            </div>
            
            ${currentUser.role === 'admin' || currentUser.role === 'doctor' ? `
                <div class="detail-actions">
                    <button class="btn btn-secondary" onclick="editLabResult('${resultId}')">
                        <i class="fas fa-edit"></i> Edit Result
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    openModal(viewModal);
}

function editLabResult(resultId) {
    const result = labResults.find(l => l.id === resultId);
    if (!result) {
        showToast('Error', 'Lab result not found', 'error');
        return;
    }
    
    currentEditRecord = { type: 'lab_result', id: resultId, data: result };
    
    editModalTitle.textContent = 'Edit Lab Result';
    editModalSubtitle.textContent = result.testName;
    
    editForm.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="editLabTestDate"><i class="fas fa-calendar"></i> Test Date</label>
                <input type="date" id="editLabTestDate" class="form-control" value="${result.testDate}">
            </div>
            <div class="form-group">
                <label for="editLabTestType"><i class="fas fa-vial"></i> Test Type</label>
                <select id="editLabTestType" class="form-control">
                    <option value="blood" ${result.testType === 'blood' ? 'selected' : ''}>Blood Test</option>
                    <option value="urine" ${result.testType === 'urine' ? 'selected' : ''}>Urine Test</option>
                    <option value="stool" ${result.testType === 'stool' ? 'selected' : ''}>Stool Test</option>
                    <option value="imaging" ${result.testType === 'imaging' ? 'selected' : ''}>Imaging</option>
                    <option value="biopsy" ${result.testType === 'biopsy' ? 'selected' : ''}>Biopsy</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editLabTestName"><i class="fas fa-flask"></i> Test Name</label>
                <input type="text" id="editLabTestName" class="form-control" value="${result.testName}">
            </div>
            <div class="form-group">
                <label for="editLabStatus"><i class="fas fa-tasks"></i> Status</label>
                <select id="editLabStatus" class="form-control">
                    <option value="completed" ${result.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="pending" ${result.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="in_progress" ${result.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <label for="editLabResult"><i class="fas fa-file-medical-alt"></i> Results</label>
            <textarea id="editLabResult" class="form-control" rows="4">${result.result}</textarea>
        </div>
        
        <div class="form-group">
            <label for="editLabNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="editLabNotes" class="form-control" rows="2">${result.notes || ''}</textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Update Lab Result';
    executeQuickAction.onclick = updateLabResult;
    
    openModal(editModal);
}

async function updateLabResult() {
    const resultData = {
        testDate: document.getElementById('editLabTestDate').value,
        testType: document.getElementById('editLabTestType').value,
        testName: document.getElementById('editLabTestName').value.trim(),
        result: document.getElementById('editLabResult').value.trim(),
        status: document.getElementById('editLabStatus').value,
        notes: document.getElementById('editLabNotes').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    if (resultData.status === 'completed' && currentUser.role === 'doctor') {
        resultData.reviewedBy = currentUser.id;
    }
    
    try {
        const result = await dataManager.updateRecord('labResults', currentEditRecord.id, resultData);
        if (result.success) {
            showToast('Success', 'Lab result updated successfully!', 'success');
            closeModal(editModal);
            showLabResultsTab();
        } else {
            showToast('Error', 'Failed to update lab result', 'error');
        }
    } catch (error) {
        console.error('Error updating lab result:', error);
        showToast('Error', 'Failed to update lab result', 'error');
    }
}

// Medication Functions
function viewMedicationDetails(medicationId) {
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) {
        showToast('Error', 'Medication not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === medication.patientId);
    const doctor = users.find(u => u.id === medication.prescribedBy);
    
    viewModalTitle.textContent = 'Medication Details';
    viewModalSubtitle.textContent = medication.medicationName;
    
    viewModalBody.innerHTML = `
        <div class="medication-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Medication:</span>
                    <span class="detail-value">${medication.medicationName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Dosage:</span>
                    <span class="detail-value">${medication.dosage}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Frequency:</span>
                    <span class="detail-value">${medication.frequency}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duration:</span>
                    <span class="detail-value">${medication.duration}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge ${medication.status === 'active' ? 'status-active' : 'status-completed'}">
                            ${medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                        </span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Refills:</span>
                    <span class="detail-value">${medication.refills}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-injured"></i> Patient Information</h4>
                <div class="detail-item">
                    <span class="detail-label">Patient:</span>
                    <span class="detail-value">${patient ? `${patient.firstName} ${patient.lastName}` : medication.patientId}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user-md"></i> Prescription Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Prescribed By:</span>
                        <span class="detail-value">${medication.prescribedByName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Prescribed At:</span>
                        <span class="detail-value">${new Date(medication.prescribedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pharmacy:</span>
                        <span class="detail-value">${medication.pharmacy}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Instructions</h4>
                <div class="detail-content">
                    ${medication.instructions.replace(/\n/g, '<br>')}
                </div>
            </div>
            
            ${medication.notes ? `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                    <div class="detail-content">
                        ${medication.notes}
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-history"></i> Medication History</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Created:</span>
                        <span class="detail-value">${new Date(medication.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated:</span>
                        <span class="detail-value">${new Date(medication.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-actions">
                ${medication.status === 'active' && currentUser.role === 'patient' ? `
                    <button class="btn btn-warning" onclick="requestRefill('${medicationId}')">
                        <i class="fas fa-redo"></i> Request Refill
                    </button>
                ` : ''}
                ${medication.status === 'active' && (currentUser.role === 'admin' || currentUser.role === 'doctor') ? `
                    <button class="btn btn-success" onclick="completeMedication('${medicationId}')">
                        <i class="fas fa-check"></i> Mark as Complete
                    </button>
                    <button class="btn btn-secondary" onclick="editMedication('${medicationId}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    openModal(viewModal);
}

function editMedication(medicationId) {
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) {
        showToast('Error', 'Medication not found', 'error');
        return;
    }
    
    currentEditRecord = { type: 'medication', id: medicationId, data: medication };
    
    editModalTitle.textContent = 'Edit Medication';
    editModalSubtitle.textContent = medication.medicationName;
    
    editForm.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="editMedicationName"><i class="fas fa-pills"></i> Medication Name</label>
                <input type="text" id="editMedicationName" class="form-control" value="${medication.medicationName}">
            </div>
            <div class="form-group">
                <label for="editMedicationDosage"><i class="fas fa-prescription-bottle-alt"></i> Dosage</label>
                <input type="text" id="editMedicationDosage" class="form-control" value="${medication.dosage}">
            </div>
            <div class="form-group">
                <label for="editMedicationFrequency"><i class="fas fa-clock"></i> Frequency</label>
                <select id="editMedicationFrequency" class="form-control">
                    <option value="Once daily" ${medication.frequency === 'Once daily' ? 'selected' : ''}>Once daily</option>
                    <option value="Twice daily" ${medication.frequency === 'Twice daily' ? 'selected' : ''}>Twice daily</option>
                    <option value="Three times daily" ${medication.frequency === 'Three times daily' ? 'selected' : ''}>Three times daily</option>
                    <option value="Four times daily" ${medication.frequency === 'Four times daily' ? 'selected' : ''}>Four times daily</option>
                    <option value="Every 6 hours" ${medication.frequency === 'Every 6 hours' ? 'selected' : ''}>Every 6 hours</option>
                    <option value="Every 8 hours" ${medication.frequency === 'Every 8 hours' ? 'selected' : ''}>Every 8 hours</option>
                    <option value="Every 12 hours" ${medication.frequency === 'Every 12 hours' ? 'selected' : ''}>Every 12 hours</option>
                    <option value="As needed" ${medication.frequency === 'As needed' ? 'selected' : ''}>As needed</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editMedicationDuration"><i class="fas fa-calendar"></i> Duration</label>
                <input type="text" id="editMedicationDuration" class="form-control" value="${medication.duration}">
            </div>
            <div class="form-group">
                <label for="editMedicationRefills"><i class="fas fa-redo"></i> Refills</label>
                <select id="editMedicationRefills" class="form-control">
                    <option value="0" ${medication.refills === 0 ? 'selected' : ''}>No refills</option>
                    <option value="1" ${medication.refills === 1 ? 'selected' : ''}>1 refill</option>
                    <option value="2" ${medication.refills === 2 ? 'selected' : ''}>2 refills</option>
                    <option value="3" ${medication.refills === 3 ? 'selected' : ''}>3 refills</option>
                    <option value="4" ${medication.refills === 4 ? 'selected' : ''}>4 refills</option>
                    <option value="5" ${medication.refills === 5 ? 'selected' : ''}>5 refills</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editMedicationPharmacy"><i class="fas fa-clinic-medical"></i> Pharmacy</label>
                <input type="text" id="editMedicationPharmacy" class="form-control" value="${medication.pharmacy}">
            </div>
        </div>
        
        <div class="form-group">
            <label for="editMedicationInstructions"><i class="fas fa-info-circle"></i> Instructions</label>
            <textarea id="editMedicationInstructions" class="form-control" rows="3">${medication.instructions}</textarea>
        </div>
        
        <div class="form-group">
            <label for="editMedicationNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="editMedicationNotes" class="form-control" rows="2">${medication.notes || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label for="editMedicationStatus"><i class="fas fa-toggle-on"></i> Status</label>
            <select id="editMedicationStatus" class="form-control">
                <option value="active" ${medication.status === 'active' ? 'selected' : ''}>Active</option>
                <option value="completed" ${medication.status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="discontinued" ${medication.status === 'discontinued' ? 'selected' : ''}>Discontinued</option>
            </select>
        </div>
    `;
    
    executeQuickAction.textContent = 'Update Medication';
    executeQuickAction.onclick = updateMedication;
    
    openModal(editModal);
}

async function updateMedication() {
    const medicationData = {
        medicationName: document.getElementById('editMedicationName').value.trim(),
        dosage: document.getElementById('editMedicationDosage').value.trim(),
        frequency: document.getElementById('editMedicationFrequency').value,
        duration: document.getElementById('editMedicationDuration').value.trim(),
        refills: parseInt(document.getElementById('editMedicationRefills').value),
        pharmacy: document.getElementById('editMedicationPharmacy').value.trim(),
        instructions: document.getElementById('editMedicationInstructions').value.trim(),
        notes: document.getElementById('editMedicationNotes').value.trim(),
        status: document.getElementById('editMedicationStatus').value,
        updatedAt: new Date().toISOString()
    };
    
    try {
        const result = await dataManager.updateRecord('medications', currentEditRecord.id, medicationData);
        if (result.success) {
            showToast('Success', 'Medication updated successfully!', 'success');
            closeModal(editModal);
            showMedicationsTab();
        } else {
            showToast('Error', 'Failed to update medication', 'error');
        }
    } catch (error) {
        console.error('Error updating medication:', error);
        showToast('Error', 'Failed to update medication', 'error');
    }
}

async function completeMedication(medicationId) {
    try {
        const result = await dataManager.updateRecord('medications', medicationId, {
            status: 'completed',
            updatedAt: new Date().toISOString()
        });
        
        if (result.success) {
            showToast('Success', 'Medication marked as completed', 'success');
            closeModal(viewModal);
            showMedicationsTab();
        } else {
            showToast('Error', 'Failed to complete medication', 'error');
        }
    } catch (error) {
        console.error('Error completing medication:', error);
        showToast('Error', 'Failed to complete medication', 'error');
    }
}

function requestRefill(medicationId) {
    const medication = medications.find(m => m.id === medicationId);
    if (!medication) return;
    
    showToast('Info', `Refill request for ${medication.medicationName} has been submitted to the pharmacy.`, 'info');
}

// Billing/Invoice Functions
function viewInvoiceDetails(invoiceId) {
    const invoice = billingRecords.find(b => b.id === invoiceId);
    if (!invoice) {
        showToast('Error', 'Invoice not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === invoice.patientId);
    const creator = users.find(u => u.id === invoice.createdBy);
    
    viewModalTitle.textContent = 'Invoice Details';
    viewModalSubtitle.textContent = invoice.invoiceNumber;
    
    viewModalBody.innerHTML = `
        <div class="invoice-details">
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Invoice Number:</span>
                    <span class="detail-value">${invoice.invoiceNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Billing Date:</span>
                    <span class="detail-value">${new Date(invoice.billingDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Due Date:</span>
                    <span class="detail-value">${new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge ${invoice.status === 'paid' ? 'status-paid' : 'status-unpaid'}">
                            ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Patient:</span>
                    <span class="detail-value">${patient ? `${patient.firstName} ${patient.lastName}` : invoice.patientId}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${invoice.description}</span>
                </div>
            </div>
            
            <!-- Invoice Items -->
            <div class="detail-section">
                <h4><i class="fas fa-list"></i> Invoice Items</h4>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td>${item.quantity}</td>
                                    <td>KES ${item.unitPrice.toLocaleString()}</td>
                                    <td>KES ${item.amount.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Invoice Summary -->
            <div class="detail-section">
                <h4><i class="fas fa-calculator"></i> Summary</h4>
                <div class="invoice-summary-details">
                    <div class="summary-item">
                        <span>Subtotal:</span>
                        <span>KES ${invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span>Tax (5%):</span>
                        <span>KES ${invoice.tax.toLocaleString()}</span>
                    </div>
                    <div class="summary-item summary-total">
                        <span>Total:</span>
                        <span>KES ${invoice.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Payment Information -->
            ${invoice.status === 'paid' ? `
                <div class="detail-section">
                    <h4><i class="fas fa-credit-card"></i> Payment Information</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Payment Method:</span>
                            <span class="detail-value">${invoice.paymentMethod}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Transaction ID:</span>
                            <span class="detail-value">${invoice.transactionId}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Paid At:</span>
                            <span class="detail-value">${new Date(invoice.paidAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> Additional Information</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Created:</span>
                        <span class="detail-value">${new Date(invoice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Updated:</span>
                        <span class="detail-value">${new Date(invoice.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Created By:</span>
                        <span class="detail-value">${creator ? creator.firstName : 'System'}</span>
                    </div>
                </div>
            </div>
            
            ${invoice.notes ? `
                <div class="detail-section">
                    <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                    <div class="detail-content">
                        ${invoice.notes}
                    </div>
                </div>
            ` : ''}
            
            <div class="detail-actions">
                ${invoice.status === 'unpaid' && currentUser.role === 'patient' ? `
                    <button class="btn btn-success" onclick="payBill('${invoiceId}')">
                        <i class="fas fa-credit-card"></i> Pay Now
                    </button>
                ` : ''}
                ${invoice.status === 'unpaid' && (currentUser.role === 'admin' || currentUser.role === 'staff') ? `
                    <button class="btn btn-success" onclick="markAsPaid('${invoiceId}')">
                        <i class="fas fa-check"></i> Mark as Paid
                    </button>
                    <button class="btn btn-secondary" onclick="editInvoice('${invoiceId}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                ` : ''}
                ${currentUser.role === 'admin' || currentUser.role === 'staff' ? `
                    <button class="btn btn-outline" onclick="printInvoice('${invoiceId}')">
                        <i class="fas fa-print"></i> Print
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    openModal(viewModal);
}

function editInvoice(invoiceId) {
    const invoice = billingRecords.find(b => b.id === invoiceId);
    if (!invoice) {
        showToast('Error', 'Invoice not found', 'error');
        return;
    }
    
    currentEditRecord = { type: 'invoice', id: invoiceId, data: invoice };
    
    editModalTitle.textContent = 'Edit Invoice';
    editModalSubtitle.textContent = invoice.invoiceNumber;
    
    // Build invoice items HTML
    let itemsHtml = '';
    invoice.items.forEach((item, index) => {
        itemsHtml += `
            <div class="invoice-item" data-index="${index}">
                <div class="form-grid" style="grid-template-columns: 2fr 1fr 1fr 1fr auto;">
                    <input type="text" class="form-control item-description" value="${item.description}" placeholder="Item description">
                    <input type="number" class="form-control item-quantity" value="${item.quantity}" placeholder="Qty" min="1">
                    <input type="number" class="form-control item-price" value="${item.unitPrice}" placeholder="Unit Price" min="0" step="0.01">
                    <input type="text" class="form-control item-amount" value="${item.amount}" placeholder="Amount" readonly>
                    ${index > 0 ? '<button type="button" class="btn btn-danger btn-small" onclick="removeEditInvoiceItem(this)"><i class="fas fa-trash"></i></button>' : ''}
                </div>
            </div>
        `;
    });
    
    editForm.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="editInvoiceDate"><i class="fas fa-calendar"></i> Billing Date</label>
                <input type="date" id="editInvoiceDate" class="form-control" value="${invoice.billingDate}">
            </div>
            <div class="form-group">
                <label for="editDueDate"><i class="fas fa-calendar-alt"></i> Due Date</label>
                <input type="date" id="editDueDate" class="form-control" value="${invoice.dueDate}">
            </div>
            <div class="form-group">
                <label for="editInvoiceDescription"><i class="fas fa-file-alt"></i> Description</label>
                <input type="text" id="editInvoiceDescription" class="form-control" value="${invoice.description}">
            </div>
            <div class="form-group">
                <label for="editInvoiceStatus"><i class="fas fa-toggle-on"></i> Status</label>
                <select id="editInvoiceStatus" class="form-control">
                    <option value="unpaid" ${invoice.status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                    <option value="paid" ${invoice.status === 'paid' ? 'selected' : ''}>Paid</option>
                    <option value="pending_insurance" ${invoice.status === 'pending_insurance' ? 'selected' : ''}>Pending Insurance</option>
                    <option value="cancelled" ${invoice.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
        </div>
        
        <!-- Invoice Items -->
        <div class="invoice-items-container">
            <h5><i class="fas fa-list"></i> Invoice Items</h5>
            <div id="editInvoiceItemsList">
                ${itemsHtml}
            </div>
            <button type="button" class="btn btn-outline btn-small" onclick="addEditInvoiceItem()" style="margin-top: 10px;">
                <i class="fas fa-plus"></i> Add Item
            </button>
        </div>
        
        <!-- Invoice Summary -->
        <div class="invoice-summary">
            <div class="summary-item">
                <span>Subtotal:</span>
                <span id="editInvoiceSubtotal">${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Tax (5%):</span>
                <span id="editInvoiceTax">${invoice.tax.toFixed(2)}</span>
            </div>
            <div class="summary-item summary-total">
                <span>Total:</span>
                <span id="editInvoiceTotal">${invoice.total.toFixed(2)}</span>
            </div>
        </div>
        
        ${invoice.status === 'paid' ? `
            <div class="form-grid">
                <div class="form-group">
                    <label for="editPaymentMethod"><i class="fas fa-credit-card"></i> Payment Method</label>
                    <input type="text" id="editPaymentMethod" class="form-control" value="${invoice.paymentMethod || ''}">
                </div>
                <div class="form-group">
                    <label for="editTransactionId"><i class="fas fa-receipt"></i> Transaction ID</label>
                    <input type="text" id="editTransactionId" class="form-control" value="${invoice.transactionId || ''}">
                </div>
            </div>
        ` : ''}
        
        <div class="form-group">
            <label for="editInvoiceNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="editInvoiceNotes" class="form-control" rows="2">${invoice.notes || ''}</textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Update Invoice';
    executeQuickAction.onclick = updateInvoice;
    
    openModal(editModal);
    
    // Initialize invoice calculations
    updateEditInvoiceTotal();
    
    // Add event listeners for item changes
    document.querySelectorAll('.item-quantity, .item-price').forEach(input => {
        input.addEventListener('input', updateEditInvoiceTotal);
    });
}

function addEditInvoiceItem() {
    const itemsList = document.getElementById('editInvoiceItemsList');
    const index = itemsList.children.length;
    
    const newItem = document.createElement('div');
    newItem.className = 'invoice-item';
    newItem.setAttribute('data-index', index);
    newItem.innerHTML = `
        <div class="form-grid" style="grid-template-columns: 2fr 1fr 1fr 1fr auto;">
            <input type="text" class="form-control item-description" placeholder="Item description">
            <input type="number" class="form-control item-quantity" placeholder="Qty" value="1" min="1">
            <input type="number" class="form-control item-price" placeholder="Unit Price" value="0" min="0" step="0.01">
            <input type="text" class="form-control item-amount" placeholder="Amount" readonly value="0">
            <button type="button" class="btn btn-danger btn-small" onclick="removeEditInvoiceItem(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    itemsList.appendChild(newItem);
    
    // Add event listeners to new inputs
    newItem.querySelector('.item-quantity').addEventListener('input', updateEditInvoiceTotal);
    newItem.querySelector('.item-price').addEventListener('input', updateEditInvoiceTotal);
    
    updateEditInvoiceTotal();
}

function removeEditInvoiceItem(button) {
    const item = button.closest('.invoice-item');
    if (document.querySelectorAll('#editInvoiceItemsList .invoice-item').length > 1) {
        item.remove();
        updateEditInvoiceTotal();
    } else {
        showToast('Info', 'Cannot remove the last item', 'info');
    }
}

function updateEditInvoiceTotal() {
    let subtotal = 0;
    
    document.querySelectorAll('#editInvoiceItemsList .invoice-item').forEach(item => {
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const amount = quantity * price;
        
        item.querySelector('.item-amount').value = amount.toFixed(2);
        subtotal += amount;
    });
    
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    
    document.getElementById('editInvoiceSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('editInvoiceTax').textContent = tax.toFixed(2);
    document.getElementById('editInvoiceTotal').textContent = total.toFixed(2);
}

async function updateInvoice() {
    // Collect invoice items
    const items = [];
    document.querySelectorAll('#editInvoiceItemsList .invoice-item').forEach(item => {
        const description = item.querySelector('.item-description').value.trim();
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const unitPrice = parseFloat(item.querySelector('.item-price').value) || 0;
        
        if (description && quantity > 0 && unitPrice > 0) {
            items.push({
                description: description,
                quantity: quantity,
                unitPrice: unitPrice,
                amount: quantity * unitPrice
            });
        }
    });
    
    if (items.length === 0) {
        showToast('Error', 'Please add at least one invoice item', 'error');
        return;
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    const invoiceData = {
        billingDate: document.getElementById('editInvoiceDate').value,
        dueDate: document.getElementById('editDueDate').value,
        description: document.getElementById('editInvoiceDescription').value.trim(),
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: document.getElementById('editInvoiceStatus').value,
        notes: document.getElementById('editInvoiceNotes').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    // Add payment information if paid
    if (invoiceData.status === 'paid') {
        invoiceData.paymentMethod = document.getElementById('editPaymentMethod')?.value || 'manual';
        invoiceData.transactionId = document.getElementById('editTransactionId')?.value || `MAN${Date.now()}`;
        invoiceData.paidAt = new Date().toISOString();
    }
    
    try {
        const result = await dataManager.updateRecord('billing', currentEditRecord.id, invoiceData);
        if (result.success) {
            showToast('Success', 'Invoice updated successfully!', 'success');
            closeModal(editModal);
            showBillingTab();
        } else {
            showToast('Error', 'Failed to update invoice', 'error');
        }
    } catch (error) {
        console.error('Error updating invoice:', error);
        showToast('Error', 'Failed to update invoice', 'error');
    }
}

function printInvoice(invoiceId) {
    const invoice = billingRecords.find(b => b.id === invoiceId);
    if (!invoice) return;
    
    const patient = patients.find(p => p.id === invoice.patientId);
    
    const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: var(--primary); margin-bottom: 5px;">Modern Dynasty Hospital</h1>
                <p style="color: var(--gray); margin: 5px 0;">Nairobi, Kenya</p>
                <p style="color: var(--gray); margin: 5px 0;">Phone: +254 20 123 4567</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <div>
                    <h3 style="margin-bottom: 10px;">INVOICE</h3>
                    <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${new Date(invoice.billingDate).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div style="text-align: right;">
                    <p><strong>Status:</strong> 
                        <span style="padding: 4px 8px; background: ${invoice.status === 'paid' ? '#28a745' : '#dc3545'}; color: white; border-radius: 4px;">
                            ${invoice.status.toUpperCase()}
                        </span>
                    </p>
                    <p><strong>Patient ID:</strong> ${invoice.patientId}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h4 style="margin-bottom: 10px;">Bill To:</h4>
                <p><strong>${patient ? `${patient.firstName} ${patient.lastName}` : invoice.patientId}</strong></p>
                ${patient?.phoneNumber ? `<p>Phone: ${patient.phoneNumber}</p>` : ''}
                ${patient?.address ? `<p>Address: ${patient.address}</p>` : ''}
                ${patient?.insuranceProvider && patient.insuranceProvider !== 'None' ? `<p>Insurance: ${patient.insuranceProvider} (${patient.insuranceNumber || ''})</p>` : ''}
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: var(--primary); color: white;">
                        <th style="padding: 12px; text-align: left;">Description</th>
                        <th style="padding: 12px; text-align: center;">Qty</th>
                        <th style="padding: 12px; text-align: right;">Unit Price</th>
                        <th style="padding: 12px; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <td style="padding: 12px;">${item.description}</td>
                            <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                            <td style="padding: 12px; text-align: right;">KES ${item.unitPrice.toLocaleString()}</td>
                            <td style="padding: 12px; text-align: right;">KES ${item.amount.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div style="margin-left: auto; width: 300px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Subtotal:</span>
                    <span>KES ${invoice.subtotal.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Tax (5%):</span>
                    <span>KES ${invoice.tax.toLocaleString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold; border-top: 2px solid var(--primary); padding-top: 10px;">
                    <span>TOTAL:</span>
                    <span>KES ${invoice.total.toLocaleString()}</span>
                </div>
            </div>
            
            ${invoice.status === 'paid' ? `
                <div style="margin-top: 30px; padding: 20px; background: #d4edda; border-radius: 8px;">
                    <h4 style="color: #155724; margin-bottom: 10px;">Payment Information</h4>
                    <p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>
                    <p><strong>Transaction ID:</strong> ${invoice.transactionId}</p>
                    <p><strong>Paid On:</strong> ${new Date(invoice.paidAt).toLocaleDateString()}</p>
                </div>
            ` : `
                <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px;">
                    <h4 style="color: #856404; margin-bottom: 10px;">Payment Instructions</h4>
                    <p>Please make payment by the due date using one of the following methods:</p>
                    <ul style="padding-left: 20px;">
                        <li>M-Pesa: Paybill 123456, Account: ${invoice.invoiceNumber}</li>
                        <li>Bank Transfer: Account Name: Modern Dynasty Hospital</li>
                        <li>Cash Payment at Hospital Reception</li>
                    </ul>
                </div>
            `}
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: var(--gray);">
                <p>Thank you for choosing Modern Dynasty Hospital</p>
                <p>For inquiries, contact: billing@moderndynastyhospital.com | +254 20 123 4567</p>
                <p>Invoice generated on: ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Invoice ${invoice.invoiceNumber}</title>
                <style>
                    @media print {
                        @page { margin: 0; }
                        body { margin: 1.6cm; }
                    }
                </style>
            </head>
            <body>${printContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}
// ======================
// QUICK ACTION MODALS
// ======================
function openAddPatientModal() {
    currentQuickAction = 'add-patient';
    quickActionTitle.textContent = 'Add New Patient';
    
    quickActionContent.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label for="newFirstName"><i class="fas fa-user"></i> First Name *</label>
                <input type="text" id="newFirstName" class="form-control" placeholder="Enter first name" required>
            </div>
            <div class="form-group">
                <label for="newLastName"><i class="fas fa-user"></i> Last Name *</label>
                <input type="text" id="newLastName" class="form-control" placeholder="Enter last name" required>
            </div>
            <div class="form-group">
                <label for="newEmail"><i class="fas fa-envelope"></i> Email</label>
                <input type="email" id="newEmail" class="form-control" placeholder="patient@email.com">
            </div>
            <div class="form-group">
                <label for="newPhone"><i class="fas fa-phone"></i> Phone Number *</label>
                <input type="tel" id="newPhone" class="form-control" placeholder="+254712345678" required>
            </div>
            <div class="form-group">
                <label for="newNationalId"><i class="fas fa-id-card"></i> National ID</label>
                <input type="text" id="newNationalId" class="form-control" placeholder="12345678">
            </div>
            <div class="form-group">
                <label for="newDateOfBirth"><i class="fas fa-birthday-cake"></i> Date of Birth *</label>
                <input type="date" id="newDateOfBirth" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="newGender"><i class="fas fa-venus-mars"></i> Gender</label>
                <select id="newGender" class="form-control">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="newBloodGroup"><i class="fas fa-tint"></i> Blood Group</label>
                <select id="newBloodGroup" class="form-control">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label for="newAddress"><i class="fas fa-home"></i> Address</label>
                <input type="text" id="newAddress" class="form-control" placeholder="123 Street, City">
            </div>
            <div class="form-group">
                <label for="newInsuranceProvider"><i class="fas fa-shield-alt"></i> Insurance Provider</label>
                <select id="newInsuranceProvider" class="form-control">
                    <option value="None">None</option>
                    <option value="NHIF">NHIF</option>
                    <option value="AAR Healthcare">AAR Healthcare</option>
                    <option value="Jubilee Insurance">Jubilee Insurance</option>
                    <option value="Britam">Britam</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="newInsuranceNumber"><i class="fas fa-id-card-alt"></i> Insurance Number</label>
                <input type="text" id="newInsuranceNumber" class="form-control" placeholder="Insurance number">
            </div>
        </div>
        
        <div class="form-group">
            <label for="newAllergies"><i class="fas fa-allergies"></i> Allergies</label>
            <input type="text" id="newAllergies" class="form-control" placeholder="Separate with commas (e.g., Penicillin, Sulfa)">
        </div>
        
        <div class="form-group">
            <label for="newChronicConditions"><i class="fas fa-heartbeat"></i> Chronic Conditions</label>
            <input type="text" id="newChronicConditions" class="form-control" placeholder="Separate with commas (e.g., Hypertension, Diabetes)">
        </div>
        
        <div class="form-group">
            <label for="newEmergencyContact"><i class="fas fa-phone-alt"></i> Emergency Contact</label>
            <div class="form-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                <input type="text" id="newEmergencyName" class="form-control" placeholder="Contact name">
                <input type="text" id="newEmergencyRelationship" class="form-control" placeholder="Relationship">
                <input type="tel" id="newEmergencyPhone" class="form-control" placeholder="Phone number">
            </div>
        </div>
        
        <div class="form-group">
            <label for="newNotes"><i class="fas fa-sticky-note"></i> Additional Notes</label>
            <textarea id="newNotes" class="form-control" rows="3" placeholder="Any additional information..."></textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Add Patient';
    executeQuickAction.onclick = addNewPatient;
    
    openModal(quickActionModal);
}

async function addNewPatient() {
    const patientData = {
        firstName: document.getElementById('newFirstName').value.trim(),
        lastName: document.getElementById('newLastName').value.trim(),
        email: document.getElementById('newEmail').value.trim(),
        phoneNumber: document.getElementById('newPhone').value.trim(),
        nationalId: document.getElementById('newNationalId').value.trim(),
        dateOfBirth: document.getElementById('newDateOfBirth').value,
        gender: document.getElementById('newGender').value,
        bloodGroup: document.getElementById('newBloodGroup').value,
        address: document.getElementById('newAddress').value.trim(),
        insuranceProvider: document.getElementById('newInsuranceProvider').value,
        insuranceNumber: document.getElementById('newInsuranceNumber').value.trim(),
        allergies: document.getElementById('newAllergies').value.split(',').map(a => a.trim()).filter(a => a),
        chronicConditions: document.getElementById('newChronicConditions').value.split(',').map(c => c.trim()).filter(c => c),
        emergencyContact: {
            name: document.getElementById('newEmergencyName').value.trim(),
            relationship: document.getElementById('newEmergencyRelationship').value.trim(),
            phone: document.getElementById('newEmergencyPhone').value.trim()
        },
        notes: document.getElementById('newNotes').value.trim(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastVisit: new Date().toISOString()
    };
    
    // Validate required fields
    if (!patientData.firstName || !patientData.lastName || !patientData.phoneNumber || !patientData.dateOfBirth) {
        showToast('Error', 'Please fill all required fields', 'error');
        return;
    }
    
    // Generate patient ID
    patientData.id = `P${Date.now().toString().slice(-6)}`;
    
    try {
        const result = await dataManager.saveToFirebase('patients', patientData);
        if (result.success) {
            showToast('Success', `Patient ${patientData.firstName} ${patientData.lastName} added successfully!`, 'success');
            closeModal(quickActionModal);
            showPatientsTab('patients');
        } else {
            showToast('Error', 'Failed to add patient', 'error');
        }
    } catch (error) {
        console.error('Error adding patient:', error);
        showToast('Error', 'Failed to add patient', 'error');
    }
}

function openScheduleAppointmentModal() {
    currentQuickAction = 'schedule-appointment';
    quickActionTitle.textContent = 'Schedule Appointment';
    
    // Get tomorrow's date for default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Get doctors
    const doctors = users.filter(u => u.role === 'doctor' && u.status === 'active');
    
    quickActionContent.innerHTML = `
        ${currentUser.role !== 'patient' ? generatePatientDropdown('', true, 'appointmentPatientQuick') : ''}
        
        <div class="form-grid">
            <div class="form-group">
                <label for="appointmentDoctor"><i class="fas fa-user-md"></i> Doctor</label>
                <select id="appointmentDoctor" class="form-control" ${currentUser.role === 'doctor' ? 'disabled' : ''}>
                    <option value="">Select Doctor</option>
                    ${doctors.map(doctor => `
                        <option value="${doctor.id}" ${currentUser.role === 'doctor' && currentUser.id === doctor.id ? 'selected' : ''}>
                            Dr. ${doctor.firstName} ${doctor.lastName} ${doctor.specialty ? `(${doctor.specialty})` : ''}
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="appointmentDate"><i class="fas fa-calendar"></i> Date *</label>
                <input type="date" id="appointmentDate" class="form-control" value="${tomorrowStr}" min="${new Date().toISOString().split('T')[0]}" required>
            </div>
            <div class="form-group">
                <label for="appointmentTime"><i class="fas fa-clock"></i> Time *</label>
                <select id="appointmentTime" class="form-control" required>
                    <option value="">Select Time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                </select>
            </div>
            <div class="form-group">
                <label for="appointmentDuration"><i class="fas fa-hourglass-half"></i> Duration</label>
                <select id="appointmentDuration" class="form-control">
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60" selected>1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                </select>
            </div>
            <div class="form-group">
                <label for="appointmentType"><i class="fas fa-stethoscope"></i> Appointment Type</label>
                <select id="appointmentType" class="form-control">
                    <option value="consultation">Consultation</option>
                    <option value="checkup">Check-up</option>
                    <option value="followup">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="appointmentLocation"><i class="fas fa-map-marker-alt"></i> Location</label>
                <select id="appointmentLocation" class="form-control">
                    <option value="Consultation Room 1">Consultation Room 1</option>
                    <option value="Consultation Room 2">Consultation Room 2</option>
                    <option value="Consultation Room 3">Consultation Room 3</option>
                    <option value="Emergency Room">Emergency Room</option>
                    <option value="Lab">Lab</option>
                    <option value="Pharmacy">Pharmacy</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <label for="appointmentReason"><i class="fas fa-comment-medical"></i> Reason for Visit *</label>
            <textarea id="appointmentReason" class="form-control" rows="3" placeholder="Describe the reason for the appointment..." required></textarea>
        </div>
        
        <div class="form-group">
            <label for="appointmentNotes"><i class="fas fa-sticky-note"></i> Additional Notes</label>
            <textarea id="appointmentNotes" class="form-control" rows="2" placeholder="Any additional notes..."></textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Schedule Appointment';
    executeQuickAction.onclick = scheduleAppointment;
    
    openModal(quickActionModal);
}

async function scheduleAppointment() {
    let patientId;
    
    if (currentUser.role === 'patient') {
        const patient = patients.find(p => p.userId === currentUser.id);
        if (!patient) {
            showToast('Error', 'Patient record not found', 'error');
            return;
        }
        patientId = patient.id;
    } else {
        patientId = document.getElementById('appointmentPatientQuick').value;
        if (!patientId) {
            showToast('Error', 'Please select a patient', 'error');
            return;
        }
    }
    
    const patient = patients.find(p => p.id === patientId);
    const doctorId = document.getElementById('appointmentDoctor').value;
    const doctor = users.find(u => u.id === doctorId);
    
    const appointmentData = {
        patientId: patientId,
        patientUserId: patient?.userId || null,
        doctorId: doctorId,
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor',
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        type: document.getElementById('appointmentType').value,
        reason: document.getElementById('appointmentReason').value.trim(),
        duration: parseInt(document.getElementById('appointmentDuration').value),
        location: document.getElementById('appointmentLocation').value,
        notes: document.getElementById('appointmentNotes').value.trim(),
        status: 'scheduled',
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!appointmentData.date || !appointmentData.time || !appointmentData.reason) {
        showToast('Error', 'Please fill all required fields', 'error');
        return;
    }
    
    // Check for scheduling conflicts
    const existingAppointments = appointments.filter(a => 
        a.doctorId === doctorId && 
        a.date === appointmentData.date && 
        a.time === appointmentData.time &&
        a.status === 'scheduled'
    );
    
    if (existingAppointments.length > 0) {
        showToast('Warning', 'Time slot already booked. Please choose another time.', 'warning');
        return;
    }
    
    // Generate appointment ID
    appointmentData.id = `A${Date.now().toString().slice(-6)}`;
    
    try {
        const result = await dataManager.saveToFirebase('appointments', appointmentData);
        if (result.success) {
            showToast('Success', `Appointment scheduled successfully for ${appointmentData.date} at ${appointmentData.time}`, 'success');
            closeModal(quickActionModal);
            showAppointmentsTab();
        } else {
            showToast('Error', 'Failed to schedule appointment', 'error');
        }
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        showToast('Error', 'Failed to schedule appointment', 'error');
    }
}

function openCreateInvoiceModal() {
    currentQuickAction = 'create-invoice';
    quickActionTitle.textContent = 'Create Invoice';
    
    quickActionContent.innerHTML = `
        ${generatePatientDropdown('', true, 'invoicePatientQuick')}
        
        <div class="form-grid">
            <div class="form-group">
                <label for="invoiceDate"><i class="fas fa-calendar"></i> Billing Date</label>
                <input type="date" id="invoiceDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label for="dueDate"><i class="fas fa-calendar-alt"></i> Due Date</label>
                <input type="date" id="dueDate" class="form-control" value="${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
            </div>
        </div>
        
        <div class="form-group">
            <label for="invoiceDescription"><i class="fas fa-file-alt"></i> Description</label>
            <input type="text" id="invoiceDescription" class="form-control" placeholder="e.g., Consultation and Lab Tests">
        </div>
        
        <!-- Invoice Items -->
        <div class="invoice-items-container">
            <h5><i class="fas fa-list"></i> Invoice Items</h5>
            <div id="invoiceItemsList">
                <div class="invoice-item">
                    <div class="form-grid" style="grid-template-columns: 2fr 1fr 1fr 1fr auto;">
                        <input type="text" class="form-control item-description" placeholder="Item description" value="Doctor Consultation">
                        <input type="number" class="form-control item-quantity" placeholder="Qty" value="1" min="1">
                        <input type="number" class="form-control item-price" placeholder="Unit Price" value="1500" min="0" step="0.01">
                        <input type="text" class="form-control item-amount" placeholder="Amount" readonly value="1500">
                        <button type="button" class="btn btn-danger btn-small" onclick="removeInvoiceItem(this)"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-outline btn-small" onclick="addInvoiceItem()" style="margin-top: 10px;">
                <i class="fas fa-plus"></i> Add Item
            </button>
        </div>
        
        <!-- Invoice Summary -->
        <div class="invoice-summary">
            <div class="summary-item">
                <span>Subtotal:</span>
                <span id="invoiceSubtotal">0.00</span>
            </div>
            <div class="summary-item">
                <span>Tax (5%):</span>
                <span id="invoiceTax">0.00</span>
            </div>
            <div class="summary-item summary-total">
                <span>Total:</span>
                <span id="invoiceTotal">0.00</span>
            </div>
        </div>
        
        <div class="form-group">
            <label for="invoiceNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="invoiceNotes" class="form-control" rows="2" placeholder="Any additional notes..."></textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Create Invoice';
    executeQuickAction.onclick = createInvoice;
    
    openModal(quickActionModal);
    
    // Initialize invoice calculations
    updateInvoiceTotal();
    
    // Add event listeners for item changes
    document.querySelectorAll('.item-quantity, .item-price').forEach(input => {
        input.addEventListener('input', updateInvoiceTotal);
    });
}

function addInvoiceItem() {
    const itemsList = document.getElementById('invoiceItemsList');
    const newItem = document.createElement('div');
    newItem.className = 'invoice-item';
    newItem.innerHTML = `
        <div class="form-grid" style="grid-template-columns: 2fr 1fr 1fr 1fr auto;">
            <input type="text" class="form-control item-description" placeholder="Item description">
            <input type="number" class="form-control item-quantity" placeholder="Qty" value="1" min="1">
            <input type="number" class="form-control item-price" placeholder="Unit Price" value="0" min="0" step="0.01">
            <input type="text" class="form-control item-amount" placeholder="Amount" readonly value="0">
            <button type="button" class="btn btn-danger btn-small" onclick="removeInvoiceItem(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    itemsList.appendChild(newItem);
    
    // Add event listeners to new inputs
    newItem.querySelector('.item-quantity').addEventListener('input', updateInvoiceTotal);
    newItem.querySelector('.item-price').addEventListener('input', updateInvoiceTotal);
    
    updateInvoiceTotal();
}

function removeInvoiceItem(button) {
    const item = button.closest('.invoice-item');
    if (document.querySelectorAll('.invoice-item').length > 1) {
        item.remove();
        updateInvoiceTotal();
    } else {
        showToast('Info', 'Cannot remove the last item', 'info');
    }
}

function updateInvoiceTotal() {
    let subtotal = 0;
    
    document.querySelectorAll('.invoice-item').forEach(item => {
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        const amount = quantity * price;
        
        item.querySelector('.item-amount').value = amount.toFixed(2);
        subtotal += amount;
    });
    
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    
    document.getElementById('invoiceSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('invoiceTax').textContent = tax.toFixed(2);
    document.getElementById('invoiceTotal').textContent = total.toFixed(2);
}

async function createInvoice() {
    const patientId = document.getElementById('invoicePatientQuick').value;
    if (!patientId) {
        showToast('Error', 'Please select a patient', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === patientId);
    
    // Collect invoice items
    const items = [];
    document.querySelectorAll('.invoice-item').forEach(item => {
        const description = item.querySelector('.item-description').value.trim();
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const unitPrice = parseFloat(item.querySelector('.item-price').value) || 0;
        
        if (description && quantity > 0 && unitPrice > 0) {
            items.push({
                description: description,
                quantity: quantity,
                unitPrice: unitPrice,
                amount: quantity * unitPrice
            });
        }
    });
    
    if (items.length === 0) {
        showToast('Error', 'Please add at least one invoice item', 'error');
        return;
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    const invoiceData = {
        patientId: patientId,
        patientUserId: patient?.userId || null,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        billingDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        description: document.getElementById('invoiceDescription').value.trim() || 'Medical Services',
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        currency: 'KES',
        status: 'unpaid',
        paymentMethod: '',
        transactionId: '',
        paidAt: null,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: document.getElementById('invoiceNotes').value.trim()
    };
    
    try {
        const result = await dataManager.saveToFirebase('billing', invoiceData);
        if (result.success) {
            showToast('Success', `Invoice ${invoiceData.invoiceNumber} created successfully!`, 'success');
            closeModal(quickActionModal);
            showBillingTab();
        } else {
            showToast('Error', 'Failed to create invoice', 'error');
        }
    } catch (error) {
        console.error('Error creating invoice:', error);
        showToast('Error', 'Failed to create invoice', 'error');
    }
}

function openPrescribeMedicationModal() {
    currentQuickAction = 'prescribe-medication';
    quickActionTitle.textContent = 'Prescribe Medication';
    
    quickActionContent.innerHTML = `
        ${generatePatientDropdown('', true, 'medicationPatientQuick')}
        
        <div class="form-grid">
            <div class="form-group">
                <label for="medicationName"><i class="fas fa-pills"></i> Medication Name *</label>
                <input type="text" id="medicationName" class="form-control" placeholder="e.g., Amoxicillin" required>
            </div>
            <div class="form-group">
                <label for="medicationDosage"><i class="fas fa-prescription-bottle-alt"></i> Dosage *</label>
                <input type="text" id="medicationDosage" class="form-control" placeholder="e.g., 500mg" required>
            </div>
            <div class="form-group">
                <label for="medicationFrequency"><i class="fas fa-clock"></i> Frequency *</label>
                <select id="medicationFrequency" class="form-control" required>
                    <option value="">Select Frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="Every 12 hours">Every 12 hours</option>
                    <option value="As needed">As needed</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="medicationDuration"><i class="fas fa-calendar"></i> Duration</label>
                <input type="text" id="medicationDuration" class="form-control" placeholder="e.g., 7 days, Ongoing, 30 days">
            </div>
            <div class="form-group">
                <label for="medicationRefills"><i class="fas fa-redo"></i> Refills</label>
                <select id="medicationRefills" class="form-control">
                    <option value="0">No refills</option>
                    <option value="1">1 refill</option>
                    <option value="2">2 refills</option>
                    <option value="3" selected>3 refills</option>
                    <option value="4">4 refills</option>
                    <option value="5">5 refills</option>
                </select>
            </div>
            <div class="form-group">
                <label for="medicationPharmacy"><i class="fas fa-clinic-medical"></i> Pharmacy</label>
                <input type="text" id="medicationPharmacy" class="form-control" placeholder="e.g., Hospital Pharmacy" value="Hospital Pharmacy">
            </div>
        </div>
        
        <div class="form-group">
            <label for="medicationInstructions"><i class="fas fa-info-circle"></i> Instructions *</label>
            <textarea id="medicationInstructions" class="form-control" rows="3" placeholder="e.g., Take with food, Avoid alcohol, etc." required></textarea>
        </div>
        
        <div class="form-group">
            <label for="medicationNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="medicationNotes" class="form-control" rows="2" placeholder="Any additional notes..."></textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Prescribe Medication';
    executeQuickAction.onclick = prescribeMedication;
    
    openModal(quickActionModal);
}

async function prescribeMedication() {
    const patientId = document.getElementById('medicationPatientQuick').value;
    if (!patientId) {
        showToast('Error', 'Please select a patient', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === patientId);
    
    const medicationData = {
        patientId: patientId,
        patientUserId: patient?.userId || null,
        medicationName: document.getElementById('medicationName').value.trim(),
        dosage: document.getElementById('medicationDosage').value.trim(),
        frequency: document.getElementById('medicationFrequency').value,
        duration: document.getElementById('medicationDuration').value.trim() || 'As prescribed',
        instructions: document.getElementById('medicationInstructions').value.trim(),
        refills: parseInt(document.getElementById('medicationRefills').value),
        pharmacy: document.getElementById('medicationPharmacy').value.trim(),
        prescribedBy: currentUser.id,
        prescribedByName: `Dr. ${currentUser.firstName} ${currentUser.lastName}`,
        prescribedAt: new Date().toISOString(),
        status: 'active',
        notes: document.getElementById('medicationNotes').value.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!medicationData.medicationName || !medicationData.dosage || !medicationData.frequency || !medicationData.instructions) {
        showToast('Error', 'Please fill all required fields', 'error');
        return;
    }
    
    // Generate medication ID
    medicationData.id = `M${Date.now().toString().slice(-6)}`;
    
    try {
        const result = await dataManager.saveToFirebase('medications', medicationData);
        if (result.success) {
            showToast('Success', `${medicationData.medicationName} prescribed successfully!`, 'success');
            closeModal(quickActionModal);
            showMedicationsTab();
        } else {
            showToast('Error', 'Failed to prescribe medication', 'error');
        }
    } catch (error) {
        console.error('Error prescribing medication:', error);
        showToast('Error', 'Failed to prescribe medication', 'error');
    }
}

function openAddMedicalRecordModal() {
    currentQuickAction = 'add-medical-record';
    quickActionTitle.textContent = 'Add Medical Record';
    
    quickActionContent.innerHTML = `
        ${generatePatientDropdown('', true, 'medicalRecordPatientQuick')}
        
        <div class="form-grid">
            <div class="form-group">
                <label for="recordDate"><i class="fas fa-calendar"></i> Date</label>
                <input type="date" id="recordDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label for="recordType"><i class="fas fa-file-medical"></i> Record Type</label>
                <select id="recordType" class="form-control">
                    <option value="progress">Progress Note</option>
                    <option value="consultation">Consultation</option>
                    <option value="procedure">Procedure</option>
                    <option value="diagnosis">Diagnosis</option>
                    <option value="discharge">Discharge Summary</option>
                </select>
            </div>
            <div class="form-group">
                <label for="recordTitle"><i class="fas fa-heading"></i> Title *</label>
                <input type="text" id="recordTitle" class="form-control" placeholder="e.g., Hypertension Follow-up" required>
            </div>
        </div>
        
        <div class="form-group">
            <label for="recordDetails"><i class="fas fa-file-alt"></i> Details *</label>
            <textarea id="recordDetails" class="form-control" rows="4" placeholder="Enter clinical notes, observations, and findings..." required></textarea>
        </div>
        
        <div class="form-group">
            <label for="recordDiagnosis"><i class="fas fa-stethoscope"></i> Diagnosis</label>
            <input type="text" id="recordDiagnosis" class="form-control" placeholder="e.g., Controlled hypertension">
        </div>
        
        <div class="form-group">
            <label for="recordTreatment"><i class="fas fa-prescription"></i> Treatment/Plan</label>
            <textarea id="recordTreatment" class="form-control" rows="2" placeholder="Treatment plan, recommendations..."></textarea>
        </div>
        
        <!-- Vital Signs -->
        <div class="vital-signs">
            <h5><i class="fas fa-heartbeat"></i> Vital Signs</h5>
            <div class="form-grid">
                <div class="form-group">
                    <label for="recordBP">Blood Pressure</label>
                    <input type="text" id="recordBP" class="form-control" placeholder="e.g., 120/80">
                </div>
                <div class="form-group">
                    <label for="recordHR">Heart Rate</label>
                    <input type="text" id="recordHR" class="form-control" placeholder="e.g., 72 bpm">
                </div>
                <div class="form-group">
                    <label for="recordTemp">Temperature</label>
                    <input type="text" id="recordTemp" class="form-control" placeholder="e.g., 36.8°C">
                </div>
                <div class="form-group">
                    <label for="recordWeight">Weight</label>
                    <input type="text" id="recordWeight" class="form-control" placeholder="e.g., 65 kg">
                </div>
            </div>
        </div>
        
        <div class="form-grid">
            <div class="form-group">
                <label for="recordFollowUp"><i class="fas fa-calendar-plus"></i> Follow-up Date</label>
                <input type="date" id="recordFollowUp" class="form-control">
            </div>
        </div>
        
        <div class="form-group">
            <label for="recordNotes"><i class="fas fa-sticky-note"></i> Additional Notes</label>
            <textarea id="recordNotes" class="form-control" rows="2" placeholder="Any additional notes..."></textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Save Medical Record';
    executeQuickAction.onclick = saveMedicalRecord;
    
    openModal(quickActionModal);
}

async function saveMedicalRecord() {
    const patientId = document.getElementById('medicalRecordPatientQuick').value;
    if (!patientId) {
        showToast('Error', 'Please select a patient', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === patientId);
    
    const recordData = {
        patientId: patientId,
        patientUserId: patient?.userId || null,
        date: document.getElementById('recordDate').value,
        type: document.getElementById('recordType').value,
        title: document.getElementById('recordTitle').value.trim(),
        details: document.getElementById('recordDetails').value.trim(),
        diagnosis: document.getElementById('recordDiagnosis').value.trim(),
        treatment: document.getElementById('recordTreatment').value.trim(),
        vitalSigns: {
            bloodPressure: document.getElementById('recordBP').value.trim(),
            heartRate: document.getElementById('recordHR').value.trim(),
            temperature: document.getElementById('recordTemp').value.trim(),
            weight: document.getElementById('recordWeight').value.trim()
        },
        followUpDate: document.getElementById('recordFollowUp').value,
        doctorId: currentUser.id,
        doctorName: currentUser.role === 'doctor' ? `Dr. ${currentUser.firstName} ${currentUser.lastName}` : currentUser.firstName + ' ' + currentUser.lastName,
        notes: document.getElementById('recordNotes').value.trim(),
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!recordData.title || !recordData.details) {
        showToast('Error', 'Please fill all required fields', 'error');
        return;
    }
    
    // Generate record ID
    recordData.id = `MR${Date.now().toString().slice(-6)}`;
    
    try {
        const result = await dataManager.saveToFirebase('medicalRecords', recordData);
        if (result.success) {
            showToast('Success', `Medical record "${recordData.title}" saved successfully!`, 'success');
            closeModal(quickActionModal);
            showMedicalRecordsTab();
        } else {
            showToast('Error', 'Failed to save medical record', 'error');
        }
    } catch (error) {
        console.error('Error saving medical record:', error);
        showToast('Error', 'Failed to save medical record', 'error');
    }
}

function openAddLabResultModal() {
    currentQuickAction = 'add-lab-result';
    quickActionTitle.textContent = 'Upload Lab Result';
    
    quickActionContent.innerHTML = `
        ${generatePatientDropdown('', true, 'labResultPatientQuick')}
        
        <div class="form-grid">
            <div class="form-group">
                <label for="labTestType"><i class="fas fa-vial"></i> Test Type</label>
                <select id="labTestType" class="form-control">
                    <option value="blood">Blood Test</option>
                    <option value="urine">Urine Test</option>
                    <option value="stool">Stool Test</option>
                    <option value="imaging">Imaging</option>
                    <option value="biopsy">Biopsy</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="labTestName"><i class="fas fa-flask"></i> Test Name *</label>
                <input type="text" id="labTestName" class="form-control" placeholder="e.g., Complete Blood Count" required>
            </div>
            <div class="form-group">
                <label for="labTestDate"><i class="fas fa-calendar"></i> Test Date</label>
                <input type="date" id="labTestDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label for="labStatus"><i class="fas fa-tasks"></i> Status</label>
                <select id="labStatus" class="form-control">
                    <option value="completed" selected>Completed</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <label for="labResult"><i class="fas fa-file-medical-alt"></i> Results *</label>
            <textarea id="labResult" class="form-control" rows="4" placeholder="Enter test results, values, and findings..." required></textarea>
        </div>
        
        <div class="form-group">
            <label for="labNotes"><i class="fas fa-sticky-note"></i> Notes</label>
            <textarea id="labNotes" class="form-control" rows="2" placeholder="Any additional notes, interpretations, or recommendations..."></textarea>
        </div>
        
        <!-- File Upload -->
        <div class="form-group">
            <label for="labFileUpload"><i class="fas fa-upload"></i> Upload Result File (Optional)</label>
            <div class="file-upload">
                <input type="file" id="labFileUpload" class="form-control" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx">
                <small class="file-upload-info">PDF, Images, or Documents up to 10MB</small>
            </div>
        </div>
    `;
    
    executeQuickAction.textContent = 'Upload Lab Result';
    executeQuickAction.onclick = saveLabResult;
    
    openModal(quickActionModal);
}

async function saveLabResult() {
    const patientId = document.getElementById('labResultPatientQuick').value;
    if (!patientId) {
        showToast('Error', 'Please select a patient', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === patientId);
    
    const labData = {
        patientId: patientId,
        patientUserId: patient?.userId || null,
        testType: document.getElementById('labTestType').value,
        testName: document.getElementById('labTestName').value.trim(),
        testDate: document.getElementById('labTestDate').value,
        result: document.getElementById('labResult').value.trim(),
        status: document.getElementById('labStatus').value,
        notes: document.getElementById('labNotes').value.trim(),
        reviewedBy: currentUser.role === 'doctor' ? currentUser.id : null,
        uploadedBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!labData.testName || !labData.result) {
        showToast('Error', 'Please fill all required fields', 'error');
        return;
    }
    
    // Generate lab result ID
    labData.id = `LR${Date.now().toString().slice(-6)}`;
    
    try {
        const result = await dataManager.saveToFirebase('labResults', labData);
        if (result.success) {
            showToast('Success', `Lab result "${labData.testName}" saved successfully!`, 'success');
            
            // Handle file upload if selected
            const fileInput = document.getElementById('labFileUpload');
            if (fileInput.files.length > 0) {
                showToast('Info', 'Lab result saved. File upload simulation complete.', 'info');
            }
            
            closeModal(quickActionModal);
            showLabResultsTab();
        } else {
            showToast('Error', 'Failed to save lab result', 'error');
        }
    } catch (error) {
        console.error('Error saving lab result:', error);
        showToast('Error', 'Failed to save lab result', 'error');
    }
}
// ======================
// REPORTS TAB
// ======================
function showReportsTab() {
    const stats = dataManager.getStatistics();
    const today = new Date().toISOString().split('T')[0];
    
    // Get recent data for charts
    const recentPatients = patients.filter(p => 
        new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    
    const recentAppointments = appointments.filter(a => 
        new Date(a.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;
    
    const monthlyRevenue = billingRecords
        .filter(b => b.status === 'paid' && new Date(b.paidAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, bill) => sum + bill.total, 0);
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-chart-bar"></i> Reports & Analytics</h3>
            
            <!-- Report Filters -->
            <div class="search-filter-bar">
                <div class="filter-options">
                    <select id="reportPeriod" class="filter-select" onchange="updateReportCharts()">
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month" selected>This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                    <select id="reportType" class="filter-select" onchange="updateReportCharts()">
                        <option value="overview">Overview</option>
                        <option value="financial">Financial</option>
                        <option value="clinical">Clinical</option>
                        <option value="operational">Operational</option>
                    </select>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="exportReport()">
                        <i class="fas fa-download"></i> Export Report
                    </button>
                    <button class="btn btn-secondary" onclick="printReport()">
                        <i class="fas fa-print"></i> Print
                    </button>
                </div>
            </div>
            
            <!-- Key Statistics -->
            <div class="report-stats">
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--primary-light);">
                        <i class="fas fa-user-injured" style="color: var(--primary);"></i>
                    </div>
                    <div class="stat-content">
                        <h5>Total Patients</h5>
                        <div class="value">${stats.totalPatients}</div>
                        <div class="trend positive">+${recentPatients} this month</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #e8f5e9;">
                        <i class="fas fa-calendar-alt" style="color: #388e3c;"></i>
                    </div>
                    <div class="stat-content">
                        <h5>Appointments</h5>
                        <div class="value">${stats.totalAppointments}</div>
                        <div class="trend positive">${stats.activeAppointments} active</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #fff3e0;">
                        <i class="fas fa-file-invoice-dollar" style="color: #f57c00;"></i>
                    </div>
                    <div class="stat-content">
                        <h5>Revenue</h5>
                        <div class="value">KES ${stats.totalRevenue.toLocaleString()}</div>
                        <div class="trend positive">KES ${monthlyRevenue.toLocaleString()} this month</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #f3e5f5;">
                        <i class="fas fa-users" style="color: #7b1fa2;"></i>
                    </div>
                    <div class="stat-content">
                        <h5>Users</h5>
                        <div class="value">${stats.totalUsers}</div>
                        <div class="trend">${users.filter(u => u.status === 'active').length} active</div>
                    </div>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="charts-grid">
                <div class="chart-container">
                    <h4><i class="fas fa-chart-line"></i> Revenue Trend</h4>
                    <div class="chart-placeholder" id="revenueChart">
                        <canvas id="revenueChartCanvas"></canvas>
                    </div>
                </div>
                <div class="chart-container">
                    <h4><i class="fas fa-chart-pie"></i> Appointment Status</h4>
                    <div class="chart-placeholder" id="appointmentChart">
                        <canvas id="appointmentChartCanvas"></canvas>
                    </div>
                </div>
                <div class="chart-container">
                    <h4><i class="fas fa-chart-bar"></i> Patient Demographics</h4>
                    <div class="chart-placeholder" id="demographicsChart">
                        <canvas id="demographicsChartCanvas"></canvas>
                    </div>
                </div>
                <div class="chart-container">
                    <h4><i class="fas fa-chart-area"></i> User Activity</h4>
                    <div class="chart-placeholder" id="activityChart">
                        <canvas id="activityChartCanvas"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Detailed Report Tables -->
            <div class="report-tables">
                <!-- Recent Patients Table -->
                <div class="report-table">
                    <div class="table-header">
                        <h4><i class="fas fa-user-injured"></i> Recent Patients</h4>
                        <button class="btn btn-outline btn-small" onclick="exportRecentPatients()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Insurance</th>
                                    <th>Last Visit</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${patients.slice(0, 5).map(patient => {
                                    const age = patient.dateOfBirth ? 
                                        new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A';
                                    return `
                                        <tr>
                                            <td>${patient.id}</td>
                                            <td>${patient.firstName} ${patient.lastName}</td>
                                            <td>${age}</td>
                                            <td>${patient.gender || 'N/A'}</td>
                                            <td>${patient.insuranceProvider || 'None'}</td>
                                            <td>${new Date(patient.lastVisit).toLocaleDateString()}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Recent Bills Table -->
                <div class="report-table">
                    <div class="table-header">
                        <h4><i class="fas fa-file-invoice-dollar"></i> Recent Transactions</h4>
                        <button class="btn btn-outline btn-small" onclick="exportRecentTransactions()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Patient</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Payment Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${billingRecords.slice(0, 5).map(bill => {
                                    const patient = patients.find(p => p.id === bill.patientId);
                                    return `
                                        <tr>
                                            <td>${bill.invoiceNumber}</td>
                                            <td>${patient ? `${patient.firstName} ${patient.lastName}` : bill.patientId}</td>
                                            <td>KES ${bill.total.toLocaleString()}</td>
                                            <td>
                                                <span class="status-badge ${bill.status === 'paid' ? 'status-paid' : 'status-unpaid'}">
                                                    ${bill.status}
                                                </span>
                                            </td>
                                            <td>${new Date(bill.billingDate).toLocaleDateString()}</td>
                                            <td>${bill.paymentMethod || 'N/A'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- System Health -->
            <div class="system-health">
                <h4><i class="fas fa-heartbeat"></i> System Health</h4>
                <div class="health-grid">
                    <div class="health-item">
                        <div class="health-label">Data Integrity</div>
                        <div class="health-bar">
                            <div class="health-fill" style="width: 95%; background: var(--success);"></div>
                        </div>
                        <div class="health-value">95%</div>
                    </div>
                    <div class="health-item">
                        <div class="health-label">Storage Usage</div>
                        <div class="health-bar">
                            <div class="health-fill" style="width: 65%; background: var(--warning);"></div>
                        </div>
                        <div class="health-value">65%</div>
                    </div>
                    <div class="health-item">
                        <div class="health-label">Active Sessions</div>
                        <div class="health-bar">
                            <div class="health-fill" style="width: 30%; background: var(--primary);"></div>
                        </div>
                        <div class="health-value">${users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}</div>
                    </div>
                    <div class="health-item">
                        <div class="health-label">Uptime</div>
                        <div class="health-bar">
                            <div class="health-fill" style="width: 99.9%; background: var(--success);"></div>
                        </div>
                        <div class="health-value">99.9%</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    dashboardContent.innerHTML = content;
    
    // Initialize charts after DOM is loaded
    setTimeout(() => {
        initializeReportCharts();
    }, 100);
}

function initializeReportCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChartCanvas')?.getContext('2d');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue (KES)',
                    data: [150000, 180000, 220000, 195000, 240000, 280000, 320000, 300000, 350000, 380000, 420000, 450000],
                    borderColor: 'var(--primary)',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'KES ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Appointment Status Chart
    const appointmentCtx = document.getElementById('appointmentChartCanvas')?.getContext('2d');
    if (appointmentCtx) {
        const scheduled = appointments.filter(a => a.status === 'scheduled').length;
        const completed = appointments.filter(a => a.status === 'completed').length;
        const cancelled = appointments.filter(a => a.status === 'cancelled').length;
        
        new Chart(appointmentCtx, {
            type: 'doughnut',
            data: {
                labels: ['Scheduled', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [scheduled, completed, cancelled],
                    backgroundColor: [
                        'var(--warning)',
                        'var(--success)',
                        'var(--accent)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Demographics Chart
    const demographicsCtx = document.getElementById('demographicsChartCanvas')?.getContext('2d');
    if (demographicsCtx) {
        const malePatients = patients.filter(p => p.gender === 'male').length;
        const femalePatients = patients.filter(p => p.gender === 'female').length;
        const otherPatients = patients.filter(p => !p.gender || (p.gender !== 'male' && p.gender !== 'female')).length;
        
        new Chart(demographicsCtx, {
            type: 'bar',
            data: {
                labels: ['Male', 'Female', 'Other'],
                datasets: [{
                    label: 'Patients',
                    data: [malePatients, femalePatients, otherPatients],
                    backgroundColor: [
                        'var(--primary)',
                        'var(--accent)',
                        'var(--gray)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function updateReportCharts() {
    // This would update charts based on selected filters
    showToast('Info', 'Updating reports with selected filters...', 'info');
}

function exportReport() {
    const period = document.getElementById('reportPeriod')?.value || 'month';
    const type = document.getElementById('reportType')?.value || 'overview';
    
    const reportData = {
        period: period,
        type: type,
        generated: new Date().toISOString(),
        statistics: dataManager.getStatistics(),
        recentPatients: patients.slice(0, 10).map(p => ({
            id: p.id,
            name: `${p.firstName} ${p.lastName}`,
            age: p.dateOfBirth ? new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear() : 'N/A',
            gender: p.gender || 'N/A',
            insurance: p.insuranceProvider || 'None',
            lastVisit: new Date(p.lastVisit).toLocaleDateString()
        })),
        recentTransactions: billingRecords.slice(0, 10).map(b => ({
            invoice: b.invoiceNumber,
            patientId: b.patientId,
            amount: b.total,
            status: b.status,
            date: b.billingDate,
            paymentMethod: b.paymentMethod || 'N/A'
        }))
    };
    
    // Convert to CSV
    const csvData = [
        ['Modern Dynasty Hospital - Report', '', '', ''],
        ['Generated:', new Date().toLocaleString(), '', ''],
        ['Period:', period, 'Type:', type],
        ['', '', '', ''],
        ['Statistics', '', '', ''],
        ['Total Patients:', reportData.statistics.totalPatients, 'Total Users:', reportData.statistics.totalUsers],
        ['Total Appointments:', reportData.statistics.totalAppointments, 'Active Appointments:', reportData.statistics.activeAppointments],
        ['Pending Bills:', reportData.statistics.pendingBills, 'Total Revenue:', `KES ${reportData.statistics.totalRevenue.toLocaleString()}`],
        ['', '', '', ''],
        ['Recent Patients', '', '', ''],
        ['ID', 'Name', 'Age', 'Gender', 'Insurance', 'Last Visit'],
        ...reportData.recentPatients.map(p => [p.id, p.name, p.age, p.gender, p.insurance, p.lastVisit]),
        ['', '', '', ''],
        ['Recent Transactions', '', '', ''],
        ['Invoice #', 'Patient ID', 'Amount', 'Status', 'Date', 'Payment Method'],
        ...reportData.recentTransactions.map(t => [t.invoice, t.patientId, t.amount, t.status, t.date, t.paymentMethod])
    ];
    
    exportToCSV(csvData.flatMap(row => Array.isArray(row) ? row : [row]), `report_${period}_${type}_${new Date().getTime()}.csv`);
}

function exportRecentPatients() {
    const data = patients.slice(0, 50).map(p => ({
        'Patient ID': p.id,
        'First Name': p.firstName,
        'Last Name': p.lastName,
        'Date of Birth': p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : 'N/A',
        'Age': p.dateOfBirth ? new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear() : 'N/A',
        'Gender': p.gender || 'N/A',
        'Blood Group': p.bloodGroup || 'N/A',
        'Insurance Provider': p.insuranceProvider || 'None',
        'Insurance Number': p.insuranceNumber || 'N/A',
        'Phone Number': p.phoneNumber || 'N/A',
        'Email': p.email || 'N/A',
        'Address': p.address || 'N/A',
        'Status': p.status || 'active',
        'Created': new Date(p.createdAt).toLocaleDateString(),
        'Last Visit': p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : 'N/A'
    }));
    
    exportToCSV(data, `recent_patients_${new Date().getTime()}.csv`);
}

function exportRecentTransactions() {
    const data = billingRecords.slice(0, 50).map(b => {
        const patient = patients.find(p => p.id === b.patientId);
        return {
            'Invoice Number': b.invoiceNumber,
            'Patient ID': b.patientId,
            'Patient Name': patient ? `${patient.firstName} ${patient.lastName}` : 'N/A',
            'Billing Date': new Date(b.billingDate).toLocaleDateString(),
            'Due Date': new Date(b.dueDate).toLocaleDateString(),
            'Description': b.description,
            'Subtotal': b.subtotal,
            'Tax': b.tax,
            'Total': b.total,
            'Currency': b.currency,
            'Status': b.status,
            'Payment Method': b.paymentMethod || 'N/A',
            'Transaction ID': b.transactionId || 'N/A',
            'Paid At': b.paidAt ? new Date(b.paidAt).toLocaleDateString() : 'N/A',
            'Created': new Date(b.createdAt).toLocaleDateString()
        };
    });
    
    exportToCSV(data, `transactions_${new Date().getTime()}.csv`);
}

function printReport() {
    const printContent = document.querySelector('.dashboard-content.active').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="text-align: center; color: var(--primary);">Modern Dynasty Hospital</h1>
            <h2 style="text-align: center;">Report - ${new Date().toLocaleDateString()}</h2>
            <hr>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    showToast('Info', 'Print dialog opened', 'info');
}
// Update the showUsersTab function to fix the admin check
function showUsersTab() {
    console.log("🔄 Opening Users Tab...");
    console.log("Current User:", currentUser);
    console.log("Current User Role:", currentUser?.role);
    
    if (!currentUser || currentUser.role !== 'admin') {
        dashboardContent.innerHTML = `
            <div class="dashboard-content active">
                <div class="empty-state">
                    <i class="fas fa-ban"></i>
                    <h3>Access Denied</h3>
                    <p>User management is restricted to administrators only.</p>
                    <p>Your role: ${currentUser?.role || 'Not logged in'}</p>
                    <button class="btn btn-primary" onclick="showTabContent('patients')">
                        <i class="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    const searchTerm = localStorage.getItem('user_search') || '';
    const roleFilter = localStorage.getItem('user_role') || '';
    const statusFilter = localStorage.getItem('user_status') || '';
    const page = currentPage.users || 1;
    
    // Filter users based on search and filters
    let filteredUsers = [...users];
    
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(u => {
            const searchLower = searchTerm.toLowerCase();
            const userString = `
                ${u.firstName || ''} 
                ${u.lastName || ''} 
                ${u.email || ''} 
                ${u.role || ''}
            `.toLowerCase();
            return userString.includes(searchLower);
        });
    }
    
    if (roleFilter && roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter && statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
    }
    
    // Pagination
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;
    
    let content = `
        <div class="dashboard-content active">
            <h3><i class="fas fa-users-cog"></i> User Management</h3>
            
            <!-- Search and Filter Bar -->
            <div class="search-filter-bar">
                <div class="search-box">
                    <input type="text" id="userSearch" placeholder="Search users by name, email, or role..." value="${searchTerm}">
                    <i class="fas fa-search"></i>
                </div>
                <div class="filter-options">
                    <div class="filter-dropdown">
                        <select id="roleFilter" onchange="filterUsersByRole(this.value)">
                            <option value="all">All Roles</option>
                            <option value="admin" ${roleFilter === 'admin' ? 'selected' : ''}>Administrators</option>
                            <option value="doctor" ${roleFilter === 'doctor' ? 'selected' : ''}>Doctors</option>
                            <option value="nurse" ${roleFilter === 'nurse' ? 'selected' : ''}>Nurses</option>
                            <option value="staff" ${roleFilter === 'staff' ? 'selected' : ''}>Staff</option>
                            <option value="patient" ${roleFilter === 'patient' ? 'selected' : ''}>Patients</option>
                            <option value="pending_approval" ${roleFilter === 'pending_approval' ? 'selected' : ''}>Pending Approval</option>
                        </select>
                    </div>
                    <div class="filter-dropdown">
                        <select id="statusFilter" onchange="filterUsersByStatus(this.value)">
                            <option value="all">All Status</option>
                            <option value="active" ${statusFilter === 'active' ? 'selected' : ''}>Active</option>
                            <option value="pending" ${statusFilter === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="suspended" ${statusFilter === 'suspended' ? 'selected' : ''}>Suspended</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="exportUsers()">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>
            
            <!-- User Statistics -->
            <div class="billing-stats">
                <div class="stat-card-small">
                    <h5>Total Users</h5>
                    <div class="value">${totalUsers}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Active</h5>
                    <div class="value" style="color: var(--success);">${activeUsers}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Pending</h5>
                    <div class="value" style="color: var(--warning);">${pendingUsers}</div>
                </div>
                <div class="stat-card-small">
                    <h5>Suspended</h5>
                    <div class="value" style="color: var(--accent);">${suspendedUsers}</div>
                </div>
            </div>
            
            <!-- Users List -->
            <h4><i class="fas fa-list"></i> User List (${totalItems})</h4>
            
            ${paginatedUsers.length === 0 ? `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No users found</p>
                    ${searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? '<p>Try changing your filters</p>' : ''}
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${paginatedUsers.map(user => {
                                const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never';
                                const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
                                const firstName = user.firstName || '';
                                const lastName = user.lastName || '';
                                const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
                                const userId = String(user.id || '');
                                const shortId = userId.length > 8 ? userId.substring(0, 8) + '...' : userId;
                                
                                return `
                                    <tr>
                                        <td>
                                            <div class="user-info">
                                                <div class="user-avatar-small">${initials}</div>
                                                <div>
                                                    <strong>${firstName} ${lastName}</strong>
                                                    <br>
                                                    <small>ID: ${shortId}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${user.email || 'N/A'}</td>
                                        <td>
                                            <span class="role-badge role-${user.role || 'unknown'}">
                                                ${getRoleDisplayName(user.role || 'unknown')}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-badge ${user.status === 'active' ? 'status-active' : user.status === 'pending' ? 'status-pending' : 'status-suspended'}">
                                                ${user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                                            </span>
                                        </td>
                                        <td>${createdAt}</td>
                                        <td>${lastLogin}</td>
                                        <td>
                                            <div class="data-table-actions">
                                                <button class="btn btn-outline btn-small" onclick="viewUserDetails('${userId}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                               ${user.status === 'pending' && user.role === 'pending_approval' ? `
    <div class="dropdown" id="approveDropdown_${userId}">
        <button class="btn btn-success btn-small" onclick="toggleApproveDropdown('${userId}')">
            <i class="fas fa-check"></i> Approve
        </button>
        <div class="dropdown-menu" id="approveMenu_${userId}">
            <a class="dropdown-item" onclick="approveAsDoctor('${userId}')">
                <i class="fas fa-user-md"></i> Approve as Doctor
            </a>
            <a class="dropdown-item" onclick="approveAsNurse('${userId}')">
                <i class="fas fa-user-nurse"></i> Approve as Nurse
            </a>
            <a class="dropdown-item" onclick="approveAsStaff('${userId}')">
                <i class="fas fa-user-tie"></i> Approve as Staff
            </a>
        </div>
    </div>
    <button class="btn btn-danger btn-small" onclick="rejectUser('${userId}')">
        <i class="fas fa-times"></i> Reject
    </button>
` : ''}
                                                ${user.status === 'active' && user.role !== 'admin' && userId !== currentUser.id ? `
                                                    <button class="btn btn-warning btn-small" onclick="suspendUser('${userId}')">
                                                        <i class="fas fa-ban"></i>
                                                    </button>
                                                    <button class="btn btn-secondary btn-small" onclick="changeUserRoleModal('${userId}')">
                                                        <i class="fas fa-exchange-alt"></i>
                                                    </button>
                                                ` : ''}
                                                ${user.status === 'suspended' && userId !== currentUser.id ? `
                                                    <button class="btn btn-success btn-small" onclick="reactivateUser('${userId}')">
                                                        <i class="fas fa-check-circle"></i>
                                                    </button>
                                                ` : ''}
                                                ${userId !== currentUser.id ? `
                                                    <button class="btn btn-danger btn-small" onclick="deleteUser('${userId}')">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                ${totalPages > 1 ? `
                    <div class="pagination">
                        <button class="pagination-btn ${page <= 1 ? 'disabled' : ''}" 
                                onclick="changePage('users', ${page - 1})" 
                                ${page <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        
                        ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            if (totalPages <= 5 || (pageNum >= page - 2 && pageNum <= page + 2)) {
                                return `
                                    <button class="pagination-btn ${pageNum === page ? 'active' : ''}" 
                                            onclick="changePage('users', ${pageNum})">
                                        ${pageNum}
                                    </button>
                                `;
                            }
                            return '';
                        }).filter(Boolean).join('')}
                        
                        ${totalPages > 5 && page < totalPages - 2 ? `
                            <span class="pagination-btn disabled">...</span>
                            <button class="pagination-btn" onclick="changePage('users', ${totalPages})">
                                ${totalPages}
                            </button>
                        ` : ''}
                        
                        <button class="pagination-btn ${page >= totalPages ? 'disabled' : ''}" 
                                onclick="changePage('users', ${page + 1})" 
                                ${page >= totalPages ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            `}
        </div>
    `;
    
    dashboardContent.innerHTML = content;
    
    // Add search event listener
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            localStorage.setItem('user_search', searchInput.value);
            currentPage.users = 1;
            showUsersTab();
        }, 500));
    }
    
    console.log("✅ Users Tab Loaded");
}

// Make sure these functions are properly defined
function filterUsersByRole(role) {
    console.log("Filtering users by role:", role);
    localStorage.setItem('user_role', role === 'all' ? '' : role);
    currentPage.users = 1;
    showUsersTab();
}

function filterUsersByStatus(status) {
    console.log("Filtering users by status:", status);
    localStorage.setItem('user_status', status === 'all' ? '' : status);
    currentPage.users = 1;
    showUsersTab();
}

// Also update the showTabContent function to properly handle the users tab
// In your existing showTabContent function, make sure it calls showUsersTab:
function showTabContent(tabId) {
    console.log("📊 Showing tab:", tabId);
    dashboardContent.innerHTML = '<div class="spinner"></div>';
    
    setTimeout(() => {
        switch(tabId) {
            case 'patients':
            case 'my-records':
                showPatientsTab(tabId);
                break;
            case 'appointments':
                showAppointmentsTab();
                break;
            case 'medical':
                showMedicalRecordsTab();
                break;
            case 'lab':
                showLabResultsTab();
                break;
            case 'medications':
                showMedicationsTab();
                break;
            case 'billing':
                showBillingTab();
                break;
            case 'users':
                showUsersTab(); // Make sure this is called
                break;
            case 'reports':
                showReportsTab();
                break;
            default:
                console.warn("Unknown tab:", tabId);
                dashboardContent.innerHTML = `
                    <div class="dashboard-content active">
                        <div class="empty-state">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h3>Tab Not Found</h3>
                            <p>The requested tab "${tabId}" does not exist.</p>
                        </div>
                    </div>
                `;
        }
    }, 300);
}

// Make sure the admin user exists - add this check during initialization
function checkAdminUser() {
    // Check if admin user exists
    const adminExists = users.some(u => u.email === "vincentgichana89@gmail.com" && u.role === 'admin');
    
    if (!adminExists) {
        console.log("⚠️ Admin user not found, creating default admin...");
        const adminUser = {
            id: "admin-1",
            firstName: "Vincent",
            lastName: "Gichana",
            email: "vincentgichana89@gmail.com",
            password: "Vin@40385106",
            role: "admin",
            status: "active",
            requestedRole: null,
            approvedBy: null,
            approvedAt: new Date().toISOString(),
            lastRoleChange: null,
            suspensionReason: null,
            assignedPatients: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        users.push(adminUser);
        dataManager.saveData();
        console.log("✅ Admin user created");
    }
}

// Add this to your initialization
window.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 Modern Dynasty Hospital Management System Initializing...");
    
    // Initialize Firebase
    await initializeFirebase();
    
    // Initialize Data Manager
    dataManager = new DataManager();
    
    // Check and create admin user if needed
    checkAdminUser();
    
    // ... rest of your initialization code ...
});

// Also ensure the createDashboardTabs function includes the users tab for admin
function createDashboardTabs(role) {
    dashboardTabs.innerHTML = '';
    const tabs = rolePermissions[role]?.tabs || [];
    
    tabs.forEach((tab, index) => {
        const tabElement = document.createElement('button');
        tabElement.className = `dashboard-tab ${index === 0 ? 'active' : ''}`;
        tabElement.innerHTML = `<i class="fas ${tab.icon}"></i> <span>${tab.name}</span>`;
        tabElement.onclick = () => {
            console.log("Tab clicked:", tab.id);
            document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
            tabElement.classList.add('active');
            showTabContent(tab.id);
        };
        dashboardTabs.appendChild(tabElement);
    });
}

// ======================
// USER MANAGEMENT FUNCTIONS
// ======================
function filterUsersByRole(role) {
    localStorage.setItem('user_role', role);
    currentPage.users = 1;
    showUsersTab();
}

function filterUsersByStatus(status) {
    localStorage.setItem('user_status', status);
    currentPage.users = 1;
    showUsersTab();
}

function approveAsDoctor(userId) {
    approvePendingUser(userId, 'doctor');
}

function approveAsNurse(userId) {
    approvePendingUser(userId, 'nurse');
}

function approveAsStaff(userId) {
    approvePendingUser(userId, 'staff');
}

async function approvePendingUser(userId, role) {
    const result = await changeUserRole(userId, role, 'Initial approval after registration');
    if (result.success) {
        showToast('Success', result.message, 'success');
        showUsersTab();
    } else {
        showToast('Error', result.message, 'error');
    }
}

function changeUserRoleModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    currentEditRecord = { type: 'user_role', id: userId, data: user };
    
    editModalTitle.textContent = 'Change User Role';
    editModalSubtitle.textContent = `Change role for ${user.firstName} ${user.lastName}`;
    
    editForm.innerHTML = `
        <div class="form-group">
            <label for="newRole">New Role</label>
            <select id="newRole" class="form-control">
                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
                <option value="doctor" ${user.role === 'doctor' ? 'selected' : ''}>Doctor</option>
                <option value="nurse" ${user.role === 'nurse' ? 'selected' : ''}>Nurse</option>
                <option value="staff" ${user.role === 'staff' ? 'selected' : ''}>Staff</option>
                <option value="patient" ${user.role === 'patient' ? 'selected' : ''}>Patient</option>
            </select>
        </div>
        <div class="form-group">
            <label for="roleChangeReason">Reason for Change</label>
            <textarea id="roleChangeReason" class="form-control" rows="3" placeholder="Enter reason for role change..."></textarea>
        </div>
    `;
    
    executeQuickAction.textContent = 'Change Role';
    executeQuickAction.onclick = async () => {
        const newRole = document.getElementById('newRole').value;
        const reason = document.getElementById('roleChangeReason').value || 'Role change by administrator';
        
        if (!newRole) {
            showToast('Error', 'Please select a role', 'error');
            return;
        }
        
        if (newRole === user.role) {
            showToast('Info', 'User already has this role', 'info');
            return;
        }
        
        const result = await changeUserRole(userId, newRole, reason);
        if (result.success) {
            showToast('Success', result.message, 'success');
            closeModal(editModal);
            showUsersTab();
        } else {
            showToast('Error', result.message, 'error');
        }
    };
    
    openModal(editModal);
}

function exportUsers() {
    const data = users.map(user => ({
        'ID': user.id,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        'Email': user.email,
        'Role': getRoleDisplayName(user.role),
        'Status': user.status,
        'Created': new Date(user.createdAt).toLocaleDateString(),
        'Last Login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
        'Approved By': user.approvedBy || 'N/A',
        'Suspension Reason': user.suspensionReason || 'N/A'
    }));
    
    exportToCSV(data, 'users_export.csv');
}

function exportToCSV(data, filename) {
    if (data.length === 0) {
        showToast('Error', 'No data to export', 'error');
        return;
    }
    
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
    
    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showToast('Success', `Exported ${data.length} records to ${filename}`, 'success');
}
// Add safe data access helpers
function safeString(value, defaultValue = 'N/A') {
    if (value === null || value === undefined) return defaultValue;
    return String(value);
}

function safeDate(value, defaultValue = 'N/A') {
    if (!value) return defaultValue;
    try {
        return new Date(value).toLocaleDateString();
    } catch {
        return defaultValue;
    }
}

function safeNumber(value, defaultValue = 0) {
    if (value === null || value === undefined) return defaultValue;
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
}
// ======================
// APPROVAL DROPDOWN FUNCTIONS
// ======================

function toggleApproveDropdown(userId) {
    const menu = document.getElementById(`approveMenu_${userId}`);
    if (!menu) return;
    
    // Close all other dropdowns
    document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
        if (dropdown.id !== `approveMenu_${userId}`) {
            dropdown.classList.remove('show');
        }
    });
    
    // Toggle current dropdown
    menu.classList.toggle('show');
    
    // Close dropdown when clicking outside
    const closeHandler = (e) => {
        if (!menu.contains(e.target) && !e.target.closest(`#approveDropdown_${userId}`)) {
            menu.classList.remove('show');
            document.removeEventListener('click', closeHandler);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeHandler);
    }, 0);
}

// Close dropdowns when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});
// ======================
// APPROVAL DROPDOWN FUNCTIONS
// ======================

function toggleApproveDropdown(userId) {
    const menu = document.getElementById(`approveMenu_${userId}`);
    if (!menu) return;
    
    // Close all other dropdowns first
    closeAllDropdowns();
    
    // Toggle current dropdown
    menu.classList.toggle('show');
    
    // Stop event from bubbling up
    if (event) event.stopPropagation();
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
    });
}

async function approveAsDoctor(userId) {
    await approveUser(userId, 'doctor');
    closeAllDropdowns();
}

async function approveAsNurse(userId) {
    await approveUser(userId, 'nurse');
    closeAllDropdowns();
}

async function approveAsStaff(userId) {
    await approveUser(userId, 'staff');
    closeAllDropdowns();
}

async function approveUser(userId, role) {
    if (!currentUser || currentUser.role !== 'admin') {
        showToast('Error', 'Only administrators can approve users', 'error');
        return;
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showToast('Error', 'User not found', 'error');
        return;
    }
    
    try {
        const result = await changeUserRole(userId, role, 'Approved by administrator');
        if (result.success) {
            showToast('Success', `User approved as ${role}`, 'success');
            showUsersTab(); // Refresh the users tab
        } else {
            showToast('Error', result.message, 'error');
        }
    } catch (error) {
        console.error('Error approving user:', error);
        showToast('Error', 'Failed to approve user', 'error');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        closeAllDropdowns();
    }
});
// ======================
// ENHANCED RECEIPT/INVOICE SYSTEM
// ======================

function printEnhancedReceipt(invoiceId) {
    const invoice = billingRecords.find(b => b.id === invoiceId);
    if (!invoice) {
        showToast('Error', 'Invoice not found', 'error');
        return;
    }
    
    const patient = patients.find(p => p.id === invoice.patientId);
    const doctor = users.find(u => u.id === invoice.createdBy);
    const hospitalInfo = {
        name: "MODERN DYNASTY HOSPITAL",
        address: "Hospital Road, Nairobi, Kenya",
        phone: "+254 20 123 4567",
        email: "info@moderndynastyhospital.com",
        website: "www.moderndynastyhospital.com",
        mpesaPaybill: "123456",
        accountNumber: invoice.invoiceNumber
    };
    
    const printWindow = window.open('', '_blank');
    const receiptHTML = createReceiptHTML(invoice, patient, doctor, hospitalInfo);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt - ${invoice.invoiceNumber}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', Arial, sans-serif;
                }
                
                body {
                    padding: 20px;
                    background: #f8f9fa;
                }
                
                .receipt-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                
                .receipt-header {
                    background: linear-gradient(135deg, #2c3e50, #3498db);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    position: relative;
                }
                
                .hospital-name {
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 5px;
                    letter-spacing: 1px;
                }
                
                .hospital-tagline {
                    font-size: 14px;
                    opacity: 0.9;
                    margin-bottom: 20px;
                }
                
                .receipt-title {
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 10px;
                    display: inline-block;
                    font-size: 20px;
                    font-weight: 500;
                }
                
                .receipt-body {
                    padding: 30px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 25px;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px dashed #eee;
                }
                
                .info-box {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #3498db;
                }
                
                .info-box h3 {
                    color: #2c3e50;
                    font-size: 16px;
                    margin-bottom: 10px;
                    font-weight: 600;
                }
                
                .info-box p {
                    margin: 5px 0;
                    color: #555;
                    font-size: 14px;
                }
                
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 25px 0;
                }
                
                .items-table th {
                    background: #2c3e50;
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: 500;
                }
                
                .items-table td {
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                }
                
                .items-table tr:hover {
                    background: #f8f9fa;
                }
                
                .total-section {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    padding: 25px;
                    border-radius: 10px;
                    margin: 25px 0;
                }
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px dashed #ddd;
                }
                
                .total-row:last-child {
                    border-bottom: none;
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .payment-info {
                    background: #e8f4ff;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 4px solid #3498db;
                }
                
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 12px;
                    border-top: 2px dashed #eee;
                    margin-top: 30px;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .status-paid {
                    background: #d4edda;
                    color: #155724;
                }
                
                .status-unpaid {
                    background: #f8d7da;
                    color: #721c24;
                }
                
                .qr-code {
                    text-align: center;
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                
                .print-button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 12px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 16px;
                    cursor: pointer;
                    text-align: center;
                }
                
                .print-button:hover {
                    background: #2980b9;
                }
                
                @media print {
                    body {
                        padding: 0;
                        background: white;
                    }
                    
                    .receipt-container {
                        box-shadow: none;
                        border-radius: 0;
                    }
                    
                    .print-button {
                        display: none;
                    }
                    
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            ${receiptHTML}
            <button class="print-button no-print" onclick="window.print()">🖨️ Print Receipt</button>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

function createReceiptHTML(invoice, patient, doctor, hospitalInfo) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-KE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = today.toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="receipt-container">
            <!-- Header -->
            <div class="receipt-header">
                <h1 class="hospital-name">${hospitalInfo.name}</h1>
                <p class="hospital-tagline">Excellence in Healthcare Service</p>
                <div class="receipt-title">
                    <i class="fas fa-file-invoice"></i> ${invoice.status === 'paid' ? 'RECEIPT' : 'INVOICE'}
                </div>
            </div>
            
            <!-- Body -->
            <div class="receipt-body">
                <!-- Invoice Status -->
                <div style="text-align: center; margin-bottom: 25px;">
                    <span class="status-badge status-${invoice.status}">
                        ${invoice.status.toUpperCase()}
                    </span>
                    <p style="margin-top: 10px; color: #666;">Generated on ${formattedDate} at ${formattedTime}</p>
                </div>
                
                <!-- Information Grid -->
                <div class="info-grid">
                    <!-- Patient Information -->
                    <div class="info-box">
                        <h3><i class="fas fa-user-injured"></i> PATIENT INFORMATION</h3>
                        <p><strong>Name:</strong> ${patient ? `${patient.firstName} ${patient.lastName}` : invoice.patientId}</p>
                        <p><strong>Patient ID:</strong> ${patient ? patient.id : invoice.patientId}</p>
                        ${patient?.phoneNumber ? `<p><strong>Phone:</strong> ${patient.phoneNumber}</p>` : ''}
                        ${patient?.insuranceProvider && patient.insuranceProvider !== 'None' ? 
                            `<p><strong>Insurance:</strong> ${patient.insuranceProvider} (${patient.insuranceNumber || ''})</p>` : 
                            '<p><strong>Insurance:</strong> Self Pay</p>'}
                    </div>
                    
                    <!-- Invoice Information -->
                    <div class="info-box">
                        <h3><i class="fas fa-receipt"></i> INVOICE DETAILS</h3>
                        <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                        <p><strong>Date Issued:</strong> ${new Date(invoice.billingDate).toLocaleDateString()}</p>
                        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
                        <p><strong>Issued By:</strong> ${doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Hospital System'}</p>
                    </div>
                </div>
                
                <!-- Description -->
                <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4><i class="fas fa-file-alt"></i> DESCRIPTION</h4>
                    <p>${invoice.description || 'Medical Services'}</p>
                </div>
                
                <!-- Items Table -->
                <h3><i class="fas fa-list"></i> BILLING ITEMS</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Amount (KES)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unitPrice.toLocaleString()}</td>
                                <td>${item.amount.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <!-- Totals -->
                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>KES ${invoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (5%):</span>
                        <span>KES ${invoice.tax.toLocaleString()}</span>
                    </div>
                    ${invoice.discount ? `
                        <div class="total-row">
                            <span>Discount:</span>
                            <span>- KES ${invoice.discount.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    <div class="total-row">
                        <span><strong>TOTAL AMOUNT:</strong></span>
                        <span><strong>KES ${invoice.total.toLocaleString()}</strong></span>
                    </div>
                </div>
                
                <!-- Payment Information -->
                ${invoice.status === 'paid' ? `
                    <div class="payment-info">
                        <h3><i class="fas fa-credit-card"></i> PAYMENT INFORMATION</h3>
                        <p><strong>Payment Method:</strong> ${invoice.paymentMethod.toUpperCase()}</p>
                        <p><strong>Transaction ID:</strong> ${invoice.transactionId}</p>
                        <p><strong>Paid Date:</strong> ${new Date(invoice.paidAt).toLocaleDateString()}</p>
                        <p><strong>Amount Paid:</strong> KES ${invoice.total.toLocaleString()}</p>
                    </div>
                ` : `
                    <div class="payment-info" style="background: #fff3cd; border-left-color: #ffc107;">
                        <h3><i class="fas fa-exclamation-circle"></i> PAYMENT INSTRUCTIONS</h3>
                        <p><strong>M-Pesa:</strong> Paybill ${hospitalInfo.mpesaPaybill}, Account: ${invoice.invoiceNumber}</p>
                        <p><strong>Bank Transfer:</strong> Account Name: ${hospitalInfo.name}, Account: ${hospitalInfo.accountNumber}</p>
                        <p><strong>Cash Payment:</strong> Present at Hospital Reception</p>
                        <p style="margin-top: 10px; font-style: italic;">Please pay before ${new Date(invoice.dueDate).toLocaleDateString()} to avoid penalties.</p>
                    </div>
                `}
                
                <!-- QR Code for Digital Payment -->
                <div class="qr-code no-print">
                    <h4><i class="fas fa-qrcode"></i> DIGITAL PAYMENT</h4>
                    <p>Scan to pay via M-Pesa</p>
                    <div style="width: 150px; height: 150px; margin: 10px auto; background: #eee; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                        <span style="color: #666;">QR Code Placeholder</span>
                    </div>
                    <p style="font-size: 11px; color: #999;">Scan with your phone's camera to pay</p>
                </div>
                
                <!-- Notes -->
                ${invoice.notes ? `
                    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <h4><i class="fas fa-sticky-note"></i> NOTES</h4>
                        <p>${invoice.notes}</p>
                    </div>
                ` : ''}
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <h3>${hospitalInfo.name}</h3>
                <p>${hospitalInfo.address} | Phone: ${hospitalInfo.phone}</p>
                <p>Email: ${hospitalInfo.email} | Website: ${hospitalInfo.website}</p>
                <p style="margin-top: 15px; font-size: 10px; color: #999;">
                    This is a computer-generated document. No signature required.
                </p>
                <p style="font-size: 10px; color: #999;">
                    Receipt ID: ${invoice.id} | Generated: ${today.toISOString()}
                </p>
            </div>
        </div>
    `;
}

// Also update your existing printInvoice function to use this enhanced version:
function printInvoice(invoiceId) {
    printEnhancedReceipt(invoiceId);
}
