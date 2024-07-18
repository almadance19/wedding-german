

        function getUrlParams() {
            const params = new URLSearchParams(window.location.search);
            return {
                plan: params.get('plan'),
                price: params.get('price'),
                valid: params.get('valid')
            };
        }

        // Function to update the HTML content based on URL parameters
        function updateOrderDetails() {
            const params = getUrlParams();
            if (params.plan && params.price && params.valid) {
                document.getElementById('product_id').innerHTML = `${params.plan} Package <span id="price_id">${params.price} €</span>`;
                document.getElementById('price_id2').innerHTML = `${params.price} €`;
                document.getElementById('price_id3').innerHTML = `${params.price} €`;
                product = String(`${params.plan} Package`).toUpperCase();
                document.getElementById('product_description').innerHTML = product;
                document.getElementById('price_description').innerHTML = `${params.price}`;
            }
        }

        // Call the function to update order details on page load
        window.onload = updateOrderDetails;

        document.getElementById('add').addEventListener('click', function(event)
        { 


        });



        document.getElementById('submit_button').addEventListener('click', function(event)
        {
            event.preventDefault(); // Prevent form from submitting normally

            const fname = document.getElementById('fname1').value;
            const lname = document.getElementById('fname2').value;
            const name = fname + ' ' + lname;
            const email = document.getElementById('email4').value;
            const phone = document.getElementById('email2').value;

            const street = document.getElementById('Adress').value;
            const post = document.getElementById('Post2').value;
            const city = document.getElementById('City').value;
            const country = document.getElementById('Country').value;
            const adress = street + ', ' + post + ' ' + city + ' , ' + country;

            const paymentMethod = document.querySelector('input[name="payment"]:checked').id;
            const product = document.getElementById('product_id').textContent;
            const price = document.getElementById('price_description').textContent;
            const product_description = document.getElementById('product_description').textContent;

            console.log(price,product_description);

            if (paymentMethod === 'remove') {
                // Remove the PayPal button
                document.getElementById('paypal-button-container').innerHTML = '';
                document.getElementById('message').innerHTML = 'Sending Email...';


                // Bank Payment - Send Email
                const data = JSON.stringify([name, adress, email, product_description, price,"notpaidyet","Bank"]);

                const scriptURL = 'https://script.google.com/macros/s/AKfycbyCseIQroVxEV5TrWXC6-k3VoZbJxmweLb_V4PgGZlidCzyrJy7XtHiqgdn-V9HGLoP/exec';

                fetch(scriptURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({ data: data })
                })
                .then(response => response.json())
                .then(response => {
                    if (response.status === 'success') {
                        // Display success message
                        document.getElementById('success').innerHTML = 'Thank you for your order! We will contact you shortly.';
                        document.getElementById('success').style.display = 'block';
                        document.getElementById('error').style.display = 'none';
                        document.getElementById('message').innerHTML = '';
                    } else {
                        // Display error message
                        document.getElementById('error').innerHTML = 'Something went wrong. Please try again.';
                        document.getElementById('success').style.display = 'none';
                        document.getElementById('error').style.display = 'block';
                        document.getElementById('message').innerHTML = '';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('success').style.display = 'none';
                    document.getElementById('error').style.display = 'block';
                });

            } else if (paymentMethod === 'add') {
                //undisplay Bank Payment
                document.getElementById('bank-button-container').style.display = 'none';
                document.getElementById('message').innerHTML = '';

                let new_price = Number(price) * 1.02;
                new_price = new_price.toFixed(2);
                nw_price = new_price.toString();


                // PayPal Payment - Create PayPal Button
                createPayPalButton(new_price,product_description,name, adress, email);
            }
        });

        function createPayPalButton(price,product_description,name, adress, email) {
            paypal.Buttons({
                createOrder: function(data, actions) {

                    return actions.order.create({
                        purchase_units: [{
                          description: 'Wedding Dance',
                          amount: {
                            currency_code: 'EUR',
                            value: price,
                            breakdown: {
                                item_total: {
                                  currency_code: 'EUR',
                                  value: price,
                                },
                                shipping: {
                                  currency_code: 'EUR',
                                  value: 0,
                                },
                                tax_total: {
                                  currency_code: 'EUR',
                                  value: 0,
                                }
                              }
                          },
                          items: [{
                            name: product_description,
                            unit_amount: {
                              currency_code: 'EUR',
                              value: price,
                            },
                            quantity: 1
                          }]
                        }]
                      });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        alert('Transaction completed by ' + details.payer.name.given_name);
                        document.getElementById('message').innerHTML = 'Payment completed! Sending Email...';

                        // Send Email
                        const data = JSON.stringify([name, adress, email, product_description, price,"paid","PayPal"]);
                         const scriptURL = 'https://script.google.com/macros/s/AKfycbyCseIQroVxEV5TrWXC6-k3VoZbJxmweLb_V4PgGZlidCzyrJy7XtHiqgdn-V9HGLoP/exec';

                        fetch(scriptURL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({ data: data })
                        })
                        .then(response => response.json())
                        .then(response => {
                            if (response.status === 'success') {
                                // Display success message
                                document.getElementById('success').innerHTML = 'Thank you for your payment! We just send you a payment confirmation via email.';
                                document.getElementById('success').style.display = 'block';
                                document.getElementById('error').style.display = 'none';
                                document.getElementById('message').innerHTML = '';
                            } else {
                                // Display error message
                                document.getElementById('error').innerHTML = 'Something went wrong sending Email. Please contact us.';
                                document.getElementById('success').style.display = 'none';
                                document.getElementById('error').style.display = 'block';
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            document.getElementById('success').style.display = 'none';
                            document.getElementById('error').style.display = 'block';
                        });






                    });
                }
            }).render('#paypal-button-container'); // Render the PayPal button
        }