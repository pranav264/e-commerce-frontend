import React, { useEffect, useRef, useState } from 'react'
import axios from "axios";
import { DataScroller } from 'primereact/datascroller';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import Cart from '../Components/Cart';
import Products from '../Components/Products';
const { REACT_APP_URL } = process.env;

const Home = ({ username }) => {
    const [products, setProducts] = useState([]);
    const [searchProducts, setSearchProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const toast = useRef(null);

    const [loadingOne, setLoadingOne] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleOne, setVisibleOne] = useState(false);

    const addToCart = async (productId) => {
        setLoadingOne(true);

        const response = await axios.post(`${REACT_APP_URL}/products/addToCart`, {
            username: username,
            productId: productId
        }, {
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        })

        toast.current.show({ severity: 'info', summary: 'Info', detail: response.data });

        if(response.data === "Item added to cart") {
            getCart();
        }


        setLoadingOne(false);
    }

    const getCart = async () => {
        const response = await axios.get(`${REACT_APP_URL}/products/getCart/${username}`, {
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        })

        setCart(response.data);
    }

    const getProducts = async () => {
        const response = await axios.get(`${REACT_APP_URL}/products/get`);
        setProducts(response.data);
        setSearchProducts(response.data);
    }

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const itemTemplate = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://primefaces.org/cdn/primereact/images/product/${data.image}`} alt={data.name} />
                    <div className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
                        <div className="flex flex-column align-items-center lg:align-items-start gap-3">
                            <div className="flex flex-column gap-1">
                                <div className="text-2xl font-bold text-900">{data.name}</div>
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
                            <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK' && (username === "" && username === null)} onClick={() => addToCart(data._id)} loading={loadingOne}></Button>
                            <Tag value={data.inventoryStatus} severity={getSeverity(data)}></Tag>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        getProducts();
    },[])

    useEffect(() => {
        if(username !== "" && username !== null) {
            getCart();
        }
    },[username])

  return (
    <div className='w-full flex flex-column gap-5 p-7'>
        <Toast ref={toast} />
        <div className='flex justify-content-start align-items-center flex-wrap gap-5'>
            <div className="p-inputgroup flex-1">
                <InputText placeholder="Keyword" />
                <Button icon="pi pi-search" />
            </div>
            <Avatar label={username[0]} size="large" shape="circle" />
            <i className='pi pi-shopping-cart p-overlay-badge cursor-pointer' style={{ fontSize: "1.5rem" }} onClick={() => setVisible(true)}>
                <Badge value={cart?.length}></Badge>
            </i>
            <Button label='My Products' onClick={() => setVisibleOne(true)} />
        </div>
        <DataScroller value={products} itemTemplate={itemTemplate} rows={5} inline scrollHeight="500px" header="Scroll Down to Load More" />

        <Dialog visible={visible} onHide={() => setVisible(false)}>
            <Cart products={cart} getSeverity={getSeverity} toast={toast} username={username} getCart={getCart} />
        </Dialog>
        <Dialog visible={visibleOne} onHide={() => setVisibleOne(false)}>
            <Products getSeverity={getSeverity} username={username} />
        </Dialog>
    </div>
  )
}

export default Home
