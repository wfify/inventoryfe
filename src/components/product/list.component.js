import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

const ListComponent = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://inventoryjs-three.vercel.app/products`, {
        headers: {
          Accept: 'application/json'
        }
      });

      console.log("API Response:", response.data);

      // Sesuaikan dengan format data dari API
      const fetchedProducts = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.products)
        ? response.data.products
        : [];

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
  };

  const deleteProduct = async (id) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'The data will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, I Confirmed',
    }).then((result) => result.isConfirmed);

    if (!isConfirm) return;

    try {
      const { data } = await axios.delete(`https://inventoryjs-three.vercel.app/products/${id}`, {
        headers: {
          Accept: 'application/json'
        }
      });

      Swal.fire({
        icon: 'success',
        text: data?.message || 'Deleted successfully'
      });

      fetchProducts();
    } catch (error) {
      const response = error.response;
      if (response?.status === 404 || response?.status === 500) {
        fetchProducts();
      } else {
        Swal.fire({
          text: response?.statusText || 'An error occurred',
          icon: 'error'
        });
      }
    }
  };

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
                    Array.isArray(products) && products.length > 0 ? (
                      products.map((row, key) => (
                        <tr key={key}>
                          <td>{row.title}</td>
                          <td>{row.description}</td>
                          <td>
                            {row.image ? (
                              <img
                                alt="product"
                                width="50"
                                src={`https://inventoryjs-three.vercel.app/storage/product/image/${row.image}`}
                              />
                            ) : 'No Image'}
                          </td>
                          <td>
                            <Link to={`/product/edit/${row.id}`} className='btn btn-success me-2'>
                              Edit
                            </Link>
                            <Button variant="danger" onClick={() => deleteProduct(row.id)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No products found.</td>
                      </tr>
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
};

export default ListComponent;
