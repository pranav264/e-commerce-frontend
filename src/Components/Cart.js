import axios from 'axios';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react'
const { REACT_APP_URL } = process.env;

const Cart = ({ products, getSeverity, toast, username, getCart }) => {
    const [loadingTwo, setLoadingTwo] = useState(false);
    const [loadingThree, setLoadingThree] = useState(false);
    const [total, setTotal] = useState(0);

    const getTotal = () => {
        let total_ = 0;

        products.forEach((product, index) => {
            total_+=product.price;
        })

        setTotal(total_);
    }

    const purchaseCart = async () => {
        setLoadingThree(true);

        paymentRequest.show().then(async (paymentResponse) => {
            // Simulate payment processing
                const response = await axios.post(`${REACT_APP_URL}/products/purchaseCart`, {
                    username: username
                }, {
                    headers: {
                        Authorization: sessionStorage.getItem("token")
                    }
                })

                toast.current.show({ severity: 'info', summary: 'Info', detail: response.data });

                if(response.data === "Purchase complete") {
                    getCart();
                }

                setTimeout(() => {
                    window.location.reload();
                },2000)
          }).catch((err) => {
            console.error('Payment request failed:', err);
          });

        setLoadingThree(false);
    }

    const removeFromCart = async (productId) => {
        setLoadingTwo(true);

        const response = await axios.post(`${REACT_APP_URL}/products/removeFromCart`, {
            username: username,
            productId: productId
        }, {
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        })

        toast.current.show({ severity: 'info', summary: 'Info', detail: response.data });

        if(response.data === "Item removed from cart") {
            getCart();
        }


        setLoadingTwo(false);
    }

    const itemTemplate = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/product/${data.image}`} alt={data.name} />
                    <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
                        <div className="flex flex-column align-items-center lg:align-items-start gap-3">
                            <div className="flex flex-column gap-1">
                                <div className="text-2xl font-bold text-900">{data.name}</div>
                                <div className="text-700">{data.description}</div>
                            </div>
                            <div className="flex flex-column gap-2">
                                <Rating value={data.rating} readOnly cancel={false}></Rating>
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag product-category-icon"></i>
                                    <span className="font-semibold">{data.category}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2">
                            <span className="text-2xl font-semibold">${data.price}</span>
                            <Button icon="pi pi-shopping-cart" label="Remove" disabled={data.inventoryStatus === 'OUTOFSTOCK'} onClick={() => removeFromCart(data._id)} loading={loadingTwo}></Button>
                            <Tag value={data.inventoryStatus} severity={getSeverity(data)}></Tag>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const supportedPaymentMethods = [
        {
          supportedMethods: 'https://bobbucks.dev/pay', // Custom payment method URL
          data: {
            // Custom data, if needed
          },
        },
      ];
    
      // Define payment details
      const paymentDetails = {
        total: {
          label: 'Total',
          amount: { currency: 'USD', value: total },
        },
      };
    
      // Define options (optional)
      const options = {};
    
      // Create a new PaymentRequest object
      const paymentRequest = new PaymentRequest(
        supportedPaymentMethods,
        paymentDetails,
        options
      );

    useEffect(() => {
        getTotal();
    },[])

    return (
        <div className="flex flex-column gap-5">
            <DataScroller value={products} itemTemplate={itemTemplate} rows={5} inline scrollHeight="500px" header="Scroll Down to Load More" />
            <Button label='Purchase' onClick={purchaseCart} loading={loadingThree} />
        </div>
    )
}

export default Cart
