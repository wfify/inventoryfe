
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

const ListComponent = () => {

    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetchProducts();

        return () => {};
    }, []);

    const fetchProducts = async() => {
        await axios.get(`https://inventoryjs-three.vercel.app/products`, {
            headers: {
                'Accept': 'application/json'
            }
        }).then(({data})=>{
            setProducts(data);
        });
    };

    const deleteProduct = async(id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'The data will be deleted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, I Confirmed',
        }).then((result) => {
            return result.isConfirmed
        });

        if (!isConfirm) {
            return;
        }

        await axios.delete(`https://inventoryjs-three.vercel.app/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        }).then(({data}) => {
            Swal.fire({
                icon: 'success',
                text: data?.message
            });
            fetchProducts();
        }).catch(({response})=> {
            if (response.status === 404 || response.status === 500) {
                fetchProducts();
            } else {
                Swal.fire({
                    text: response.statusText,
                    icon: 'error'
                });
            }
        });
    }

    return (
        <div className="container">
            <div className="row">
                <div className='col-12'>
                    <Link className='btn btn-primary mb-2 float-end' to={"/product/create"}>
                        Create Product
                    </Link>
                </div>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.length > 0 && (
                                            products.map((row, key)=>(
                                                <tr key={key}>
                                                    <td>{row.title}</td>
                                                    <td>{row.description}</td>
                                                    <td>
                                                        <img alt="text" width="50px" src={`https://inventoryjs-three.vercel.app/products/image/${row.image}`} />
                                                    </td>
                                                    <td>
                                                        <Link to={`/product/edit/${row.id}`} className='btn btn-success me-2'>
                                                            Edit
                                                        </Link>
                                                        <Button variant="danger" onClick={()=>deleteProduct(row.id)}>
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListComponent;
