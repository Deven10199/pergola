// Frontend contact form handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            submitText.textContent = 'Sending...';
            submitSpinner.classList.remove('hidden');
            contactForm.querySelector('button').disabled = true;
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                projectType: document.getElementById('projectType').value,
                timeline: document.getElementById('timeline').value,
                message: document.getElementById('message').value
            };
            
            try {
                // Replace with your actual backend URL
                const response = await fetch('http://localhost:3001/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Success message
                    formMessage.textContent = data.message;
                    formMessage.className = 'form-message success';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Scroll to message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    // Error message
                    formMessage.textContent = data.message || 'An error occurred. Please try again.';
                    formMessage.className = 'form-message error';
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.textContent = 'Unable to submit form. Please try again or call us directly.';
                formMessage.className = 'form-message error';
            } finally {
                // Reset button state
                submitText.textContent = 'Submit Request';
                submitSpinner.classList.add('hidden');
                contactForm.querySelector('button').disabled = false;
            }
        });
    }
});