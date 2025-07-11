 // Function to set the theme and update UI
 function setTheme(theme) {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    var switchThemeBtn = document.getElementById('switchTheme');
    if (switchThemeBtn) {
        switchThemeBtn.innerHTML = theme === 'dark' ?  '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    }
    //console.log(`Switched to ${theme} theme`);
}

var currentTheme = localStorage.getItem('theme') || 'dark';
setTheme(currentTheme);

// Event listener for the switch theme button
var switchThemeBtn = document.getElementById('switchTheme');
if (switchThemeBtn) {
    switchThemeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });
}

//AOS Initiliaze
AOS.init();

// Fixed Header & back to top button on Scroll
window.addEventListener('scroll', () => {
    // fixed header
    const header = document.getElementById('header');
    if (window.scrollY > 30 && !header.classList.contains('fixed-top')) {
        header.classList.add('fixed-top');
        document.getElementById('offcanvasNavbar').classList.add('fixedHeaderNavbar');
    } else if (window.scrollY <= 30 && header.classList.contains('fixed-top')) {
        header.classList.remove('fixed-top');
        document.getElementById('offcanvasNavbar').classList.remove('fixedHeaderNavbar');
    }

    //backtotop
    const backToTopButton = document.getElementById("backToTopButton");
    if (window.scrollY > 400 && backToTopButton.style.display === 'none') {
        backToTopButton.style.display = 'block';
    } else if (window.scrollY <= 400 && backToTopButton.style.display === 'block') {
        backToTopButton.style.display = 'none';
    }
});


//jumping to top function
function scrollToTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//Testimonial Slider
$(document).ready(function(){
    $("#testimonial-slider").owlCarousel({
        items:3,
        nav:true,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive:{
            0:{
                items:1,
            },
            768:{
                items:2,
            },
            1170:{
                items:3,
            }
        }
    });
});

// EmailJS contact form functionality
// Contact form with improved error handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded! Make sure the script is included properly.');
        showStatus('Email service not available. Please try again later.', 'error');
        return;
    }
    
    // Initialize EmailJS
    try {
        emailjs.init("DmUbddc289ry4lTMV"); // Replace with your actual public key
        console.log('EmailJS initialized successfully');
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        showStatus('Email service initialization failed. Please try again later.', 'error');
        return;
    }
    
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!contactForm || !submitBtn) {
        console.error('Contact form or submit button not found in the DOM!');
        return;
    }
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Check if form is valid
        if (!contactForm.checkValidity()) {
            console.log('Form validation failed');
            contactForm.reportValidity();
            return;
        }
        
        // Disable button and show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        
        // Collect form data
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            // Add current date/time for reference
            sent_at: new Date().toISOString()
        };
        
        console.log('Sending email with params:', templateParams);
        
        // Send email using EmailJS
        emailjs.send('service_x7fl9lj', 'template_959lw7g', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showStatus('Your message has been sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                let errorMsg = 'Oops! Something went wrong.';
                
                // More detailed error messages based on error type
                if (error.status === 400) {
                    errorMsg += ' There was a problem with your submission.';
                } else if (error.status === 401 || error.status === 403) {
                    errorMsg += ' Authentication issue with the email service.';
                } else if (error.status === 429) {
                    errorMsg += ' Too many emails sent recently. Please try again later.';
                }
                
                showStatus(errorMsg, 'error');
            })
            .finally(function() {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
    });
    
    function showStatus(message, type) {
        const statusDiv = document.getElementById('contact-status');
        if (!statusDiv) return;
        
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        // Clear existing classes and add appropriate styling
        statusDiv.className = 'alert';
        if (type === 'success') {
            statusDiv.classList.add('alert-success');
        } else {
            statusDiv.classList.add('alert-danger');
        }
        
        // Scroll to status message
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 10 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 10000);
        }
    }
});