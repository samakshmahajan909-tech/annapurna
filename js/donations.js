/* ===================================
   RAZORPAY INTEGRATION - TEST MODE
   Annapurna Seva
   =================================== */

// ⚠️ REPLACE THESE WITH YOUR ACTUAL TEST KEYS
const RAZORPAY_CONFIG = {
    key: 'rzp_test_SID3pNvPCYFxkt',  // ← Paste your Key ID here
    // Note: Secret key should NEVER be in frontend
    // It's only used in backend
};

document.addEventListener('DOMContentLoaded', function() {
    initDonationForm();
    loadRazorpayScript();
});

/* ===================================
   LOAD RAZORPAY SCRIPT
   =================================== */

function loadRazorpayScript() {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

/* ===================================
   DONATION FORM INITIALIZATION
   =================================== */

function initDonationForm() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.querySelector('.custom-amount input');
    const proceedBtn = document.getElementById('proceedDonate');
    let selectedAmount = 2000; // Default amount

    // Amount button selection
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            amountButtons.forEach(b => b.classList.remove('active'));
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Clear custom input
            if (customAmountInput) {
                customAmountInput.value = '';
            }
            
            // Update selected amount
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            
            // Update impact preview
            updateImpactPreview(selectedAmount);
        });
    });

    // Custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            // Remove active from all buttons
            amountButtons.forEach(b => b.classList.remove('active'));
            
            // Update selected amount
            selectedAmount = parseInt(this.value) || 0;
            
            // Update impact preview
            updateImpactPreview(selectedAmount);
        });
    }

    // Proceed to donate button
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            if (selectedAmount < 100) {
                showNotification('Please select or enter an amount of at least ₹100', 'error');
                return;
            }
            
            // Show donor details form
            showDonorDetailsModal(selectedAmount);
        });
    }
}

/* ===================================
   UPDATE IMPACT PREVIEW
   =================================== */

function updateImpactPreview(amount) {
    const previews = document.querySelectorAll('.impact-preview-item');
    
    // Find the best matching preview
    let matchingPreview = null;
    previews.forEach(preview => {
        const previewAmount = parseInt(preview.getAttribute('data-amount'));
        if (amount >= previewAmount) {
            matchingPreview = preview;
        }
    });
    
    // Update active state
    previews.forEach(p => p.classList.remove('active'));
    if (matchingPreview) {
        matchingPreview.classList.add('active');
    }
}

/* ===================================
   DONOR DETAILS MODAL
   =================================== */

function showDonorDetailsModal(amount) {
    const modal = document.createElement('div');
    modal.className = 'donor-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeDonorModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeDonorModal()">&times;</button>
            
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fas fa-hand-holding-heart"></i>
                </div>
                <h2>Complete Your Donation</h2>
                <p class="donation-amount">Amount: ₹${amount.toLocaleString()}</p>
            </div>
            
            <form id="donorDetailsForm" class="donor-form">
                <div class="form-group">
                    <input type="text" id="donorName" required placeholder=" ">
                    <label for="donorName">Full Name *</label>
                </div>
                
                <div class="form-group">
                    <input type="email" id="donorEmail" required placeholder=" ">
                    <label for="donorEmail">Email Address *</label>
                </div>
                
                <div class="form-group">
                    <input type="tel" id="donorPhone" required pattern="[0-9]{10}" placeholder=" ">
                    <label for="donorPhone">Phone Number *</label>
                    <small>10 digits only</small>
                </div>
                
                <div class="form-group">
                    <input type="text" id="donorPan" placeholder=" " style="text-transform: uppercase;">
                    <label for="donorPan">PAN (Optional)</label>
                    <small>Format: ABCDE1234F</small>
                </div>
                
                <div style="margin: 20px 0; padding: 15px; background: #fffaf0; border: 1px solid #e8d5b7; border-radius: 8px;">
                    <input type="checkbox" id="agreeTerms" required style="width: 18px; height: 18px; margin-right: 10px; cursor: pointer;">
                    <label for="agreeTerms" style="cursor: pointer; display: inline; font-size: 14px;">
                        I agree to receive updates and tax receipts via email
                    </label>
                </div>
                
                <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <i class="fas fa-flask"></i>
                    <span style="margin-left: 8px;">TEST MODE - No real money charged</span>
                </div>
                
                <button type="submit" class="btn btn-primary btn-large full-width">
                    <i class="fas fa-shield-alt"></i> Proceed to Payment
                </button>
                
                <div style="text-align: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee;">
                    <p style="font-size: 13px; color: #888;">
                        <i class="fas fa-lock"></i> Powered by Razorpay - Secure
                    </p>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    addSimpleDonorModalStyles();
    
    // Handle form submission
    const form = document.getElementById('donorDetailsForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const donorDetails = {
            name: document.getElementById('donorName').value.trim(),
            email: document.getElementById('donorEmail').value.trim(),
            phone: document.getElementById('donorPhone').value.trim(),
            pan: document.getElementById('donorPan').value.trim().toUpperCase(),
            amount: amount
        };
        
        if (donorDetails.phone.length !== 10) {
            alert('Please enter 10-digit phone number');
            return;
        }
        
        closeDonorModal();
        initiateRazorpayPayment(donorDetails);
    });
}

function closeDonorModal() {
    const modal = document.querySelector('.donor-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

/* ===================================
   RAZORPAY PAYMENT INITIATION
   =================================== */

async function initiateRazorpayPayment(donorDetails) {
    // Check if Razorpay is loaded
    if (typeof Razorpay === 'undefined') {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            showNotification('Failed to load payment gateway. Please refresh and try again.', 'error');
            return;
        }
    }

    const options = {
        key: RAZORPAY_CONFIG.key,
        amount: donorDetails.amount * 100, // Amount in paise (₹500 = 50000 paise)
        currency: 'INR',
        name: 'Annapurna Seva',
        description: 'Donation for serving humanity',
        image: 'https://img.icons8.com/fluency/96/000000/helping-hand.png', // Temporary logo
        
        // Order ID (In production, get this from your backend)
        // order_id: 'order_XXXXXXXXX',
        
        handler: function(response) {
            // Payment successful callback
            handlePaymentSuccess(response, donorDetails);
        },
        
        prefill: {
            name: donorDetails.name,
            email: donorDetails.email,
            contact: donorDetails.phone
        },
        
        notes: {
            purpose: 'Donation',
            donor_name: donorDetails.name,
            donor_pan: donorDetails.pan || 'Not provided'
        },
        
        theme: {
            color: '#B85C38' // Your primary color
        },
        
        modal: {
            ondismiss: function() {
                showNotification('Payment cancelled. You can try again anytime.', 'info');
            },
            
            escape: true,
            backdropclose: false,
            
            confirm_close: true // Ask before closing
        },
        
        retry: {
            enabled: true,
            max_count: 3
        }
    };

    try {
        const razorpay = new Razorpay(options);
        
        // Handle payment failure
        razorpay.on('payment.failed', function(response) {
            handlePaymentFailure(response);
        });
        
        // Open Razorpay checkout
        razorpay.open();
        
    } catch (error) {
        console.error('Razorpay error:', error);
        showNotification('Payment gateway error. Please try again.', 'error');
    }
}

/* ===================================
   HANDLE SUCCESSFUL PAYMENT
   =================================== */

function handlePaymentSuccess(response, donorDetails) {
    const paymentData = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id || null,
        razorpay_signature: response.razorpay_signature || null,
        amount: donorDetails.amount,
        currency: 'INR',
        donor: {
            name: donorDetails.name,
            email: donorDetails.email,
            phone: donorDetails.phone,
            pan: donorDetails.pan
        },
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
    };

    // Save to localStorage (for demo)
    saveDonationLocally(paymentData);
    
    // Show success modal
    showSuccessModal(paymentData);
    
    // In production: Send to your backend
    // sendToBackend(paymentData);
    
    console.log('Payment Success:', paymentData);
}

/* ===================================
   HANDLE PAYMENT FAILURE
   =================================== */

function handlePaymentFailure(response) {
    console.error('Payment Failed:', response.error);
    
    const errorMessage = response.error.description || 'Payment failed. Please try again.';
    
    showNotification(errorMessage, 'error');
    
    // Log failure (optional)
    const failureData = {
        error_code: response.error.code,
        error_description: response.error.description,
        error_source: response.error.source,
        error_step: response.error.step,
        error_reason: response.error.reason,
        timestamp: new Date().toISOString()
    };
    
    console.log('Payment Failure Details:', failureData);
}

/* ===================================
   SUCCESS MODAL
   =================================== */

function showSuccessModal(paymentData) {
    const modal = document.createElement('div');
    modal.className = 'payment-success-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content success-modal">
            <div class="success-animation">
                <div class="success-checkmark">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
            </div>
            
            <h2>🙏 Thank You!</h2>
            <p class="success-message">
                Your generous donation of <strong>₹${paymentData.amount.toLocaleString()}</strong> 
                has been received successfully.
            </p>
            
            <div class="test-mode-notice">
                <i class="fas fa-flask"></i>
                <p><strong>TEST MODE:</strong> This was a test transaction. No real money was charged.</p>
            </div>
            
            <div class="payment-details">
                <h3>Payment Details</h3>
                <div class="detail-row">
                    <span>Payment ID:</span>
                    <strong>${paymentData.razorpay_payment_id}</strong>
                </div>
                <div class="detail-row">
                    <span>Amount:</span>
                    <strong>₹${paymentData.amount.toLocaleString()}</strong>
                </div>
                <div class="detail-row">
                    <span>Donor Name:</span>
                    <strong>${paymentData.donor.name}</strong>
                </div>
                <div class="detail-row">
                    <span>Email:</span>
                    <strong>${paymentData.donor.email}</strong>
                </div>
                <div class="detail-row">
                    <span>Date & Time:</span>
                    <strong>${new Date(paymentData.timestamp).toLocaleString('en-IN')}</strong>
                </div>
            </div>
            
            <div class="success-info">
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>Receipt will be sent to ${paymentData.donor.email}</span>
                </div>
                ${paymentData.donor.pan ? `
                <div class="info-item">
                    <i class="fas fa-file-invoice"></i>
                    <span>80G tax certificate will be emailed within 48 hours</span>
                </div>
                ` : ''}
            </div>
            
            <div class="impact-message">
                <i class="fas fa-heart"></i>
                <p>Your contribution will help us serve approximately <strong>${Math.floor(paymentData.amount / 20)} meals</strong> to those in need!</p>
            </div>
            
            <div class="success-actions">
                <button class="btn btn-primary" onclick="downloadReceipt()">
                    <i class="fas fa-download"></i> Download Receipt
                </button>
                <button class="btn btn-secondary" onclick="closeSuccessModal()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
            
            <div class="social-share">
                <p>Share the love and inspire others:</p>
                <div class="share-buttons">
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}" target="_blank" title="Share on Facebook">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('I just donated to Annapurna Seva! Join me in making a difference.')}&url=${encodeURIComponent(window.location.origin)}" target="_blank" title="Share on Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://wa.me/?text=${encodeURIComponent('I just donated to Annapurna Seva! Check out their amazing work: ' + window.location.origin)}" target="_blank" title="Share on WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}" target="_blank" title="Share on LinkedIn">
                        <i class="fab fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addSuccessModalStyles();
    
    // Trigger checkmark animation
    setTimeout(() => {
        const checkmark = modal.querySelector('.checkmark');
        if (checkmark) {
            checkmark.classList.add('animate');
        }
    }, 100);
}

function closeSuccessModal() {
    const modal = document.querySelector('.payment-success-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function downloadReceipt() {
    // For now, just trigger print
    window.print();
    showNotification('Receipt download feature coming soon! You can print this page for now.', 'info');
}

/* ===================================
   SAVE DONATION LOCALLY
   =================================== */

function saveDonationLocally(paymentData) {
    try {
        const donations = JSON.parse(localStorage.getItem('annapurna_donations') || '[]');
        donations.push(paymentData);
        localStorage.setItem('annapurna_donations', JSON.stringify(donations));
        console.log('Donation saved locally');
    } catch (error) {
        console.error('Error saving donation:', error);
    }
}

/* ===================================
   SEND TO BACKEND (For Production)
   =================================== */

function sendToBackend(paymentData) {
    // Example: Send to your backend API
    /*
    fetch('/api/donations/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Saved to backend:', data);
        // Send confirmation email
        // Generate 80G certificate
    })
    .catch(error => {
        console.error('Backend error:', error);
    });
    */
}

/* ===================================
   NOTIFICATION HELPER
   =================================== */

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#FF9800'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-size: 0.95rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* ===================================
   STYLES FOR MODALS
   =================================== */

function addSimpleDonorModalStyles() {
    if (document.getElementById('donor-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'donor-modal-styles';
    style.textContent = `
        .donor-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .donor-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
        }
        
        .donor-modal .modal-content {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            z-index: 1;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 35px;
            height: 35px;
            border: none;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
            color: white;
        }
        
        .modal-close:hover {
            background: rgba(0,0,0,0.4);
        }
        
        .modal-header {
            text-align: center;
            padding: 40px 30px 30px;
            background: linear-gradient(135deg, #B85C38, #5C8A5E);
            color: white;
            border-radius: 20px 20px 0 0;
        }
        
        .modal-icon {
            width: 70px;
            height: 70px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 35px;
        }
        
        .modal-header h2 {
            color: white;
            margin-bottom: 8px;
            font-size: 24px;
        }
        
        .donation-amount {
            font-size: 20px;
            font-weight: 700;
            color: white;
        }
        
        .donor-form {
            padding: 30px;
        }
        
        .form-group {
            position: relative;
            margin-bottom: 20px;
        }
        
        .donor-form input {
            width: 100%;
            padding: 14px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 15px;
            background: #f9f9f9;
        }
        
        .donor-form input:focus {
            outline: none;
            border-color: #B85C38;
            background: white;
        }
        
        .donor-form label {
            position: absolute;
            left: 14px;
            top: 14px;
            color: #888;
            pointer-events: none;
            transition: all 0.3s;
        }
        
        .donor-form input:focus + label,
        .donor-form input:not(:placeholder-shown) + label {
            top: -9px;
            left: 10px;
            font-size: 12px;
            color: #B85C38;
            background: white;
            padding: 0 5px;
        }
        
        .donor-form small {
            display: block;
            margin-top: 4px;
            font-size: 12px;
            color: #888;
        }
        
        .full-width {
            width: 100%;
        }
        
        /* Make sure checkbox is clickable */
        input[type="checkbox"] {
            cursor: pointer !important;
            pointer-events: auto !important;
        }
        
        label[for="agreeTerms"] {
            cursor: pointer !important;
            pointer-events: auto !important;
        }
    `;
    
    document.head.appendChild(style);
}

function addSuccessModalStyles() {
    if (document.getElementById('success-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'success-modal-styles';
    style.textContent = `
        .payment-success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .payment-success-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .success-modal {
            position: relative;
            background: white;
            border-radius: 20px;
            max-width: 550px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 50px 40px;
            text-align: center;
            z-index: 1;
        }
        
        .success-checkmark {
            width: 100px;
            height: 100px;
            margin: 0 auto 30px;
        }
        
        .checkmark {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: block;
            stroke-width: 2;
            stroke: #4CAF50;
            stroke-miterlimit: 10;
        }
        
        .checkmark.animate .checkmark-circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .checkmark.animate .checkmark-check {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        .checkmark-circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 2;
            stroke: #4CAF50;
            fill: none;
        }
        
        .checkmark-check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            stroke: #4CAF50;
            stroke-width: 3;
        }
        
        @keyframes stroke {
            100% {
                stroke-dashoffset: 0;
            }
        }
        
        .success-modal h2 {
            font-size: 2rem;
            color: #2D2926;
            margin-bottom: 12px;
        }
        
        .success-message {
            font-size: 1.1rem;
            color: #5C5551;
            margin-bottom: 24px;
            line-height: 1.6;
        }
        
        .success-message strong {
            color: #B85C38;
            font-size: 1.3rem;
        }
        
        .test-mode-notice {
            background: #E3F2FD;
            border: 2px dashed #2196F3;
            color: #1565C0;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .test-mode-notice i {
            font-size: 1.5rem;
        }
        
        .test-mode-notice p {
            margin: 0;
            text-align: left;
        }
        
        .payment-details {
            background: #F5F1EB;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
        }
        
        .payment-details h3 {
            font-size: 1.1rem;
            color: #2D2926;
            margin-bottom: 16px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #E8E4DE;
            text-align: left;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-row span {
            color: #8A8580;
            font-size: 0.9rem;
        }
        
        .detail-row strong {
            color: #2D2926;
            font-size: 0.9rem;
            word-break: break-all;
        }
        
        .success-info {
            margin-bottom: 24px;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 12px 0;
            color: #5C5551;
            font-size: 0.95rem;
        }
        
        .info-item i {
            color: #5C8A5E;
            font-size: 1.1rem;
        }
        
        .impact-message {
            background: linear-gradient(135deg, #B85C38, #5C8A5E);
            color: white;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
        }
        
        .impact-message i {
            font-size: 2rem;
            margin-bottom: 12px;
        }
        
        .impact-message p {
            color: white;
            margin: 0;
            font-size: 1.05rem;
        }
        
        .impact-message strong {
            font-size: 1.3rem;
            color: #FFFCF7;
        }
        
        .success-actions {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .success-actions .btn {
            flex: 1;
        }
        
        .social-share {
            padding-top: 24px;
            border-top: 1px solid #E8E4DE;
        }
        
        .social-share > p {
            color: #8A8580;
            margin-bottom: 16px;
            font-size: 0.95rem;
        }
        
        .share-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        
        .share-buttons a {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .share-buttons a:nth-child(1) {
            background: #1877f2;
        }
        
        .share-buttons a:nth-child(2) {
            background: #1DA1F2;
        }
        
        .share-buttons a:nth-child(3) {
            background: #25D366;
        }
        
        .share-buttons a:nth-child(4) {
            background: #0A66C2;
        }
        
        .share-buttons a:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 480px) {
            .success-modal {
                padding: 40px 24px;
            }
            
            .success-actions {
                flex-direction: column;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 4px;
            }
        }
    `;
    
    document.head.appendChild(style);
}