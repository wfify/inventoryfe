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

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/products`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      setProducts(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: 'Failed to fetch products',
      });
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

    if (!isConfirm) {
      return;
    }

    try {
      // NOTE: di sini ada typo "hhttp" jadi harus diperbaiki jadi "http"
      const { data } = await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      Swal.fire({
        icon: 'success',
        text: data?.message,
      });
      fetchProducts();
    } catch (error) {
      // Periksa dulu apakah error.response ada untuk menghindari undefined
      if (error.response) {
        if (error.response.status === 404 || error.response.status === 500) {
          fetchProducts();
        } else {
          Swal.fire({
            text: error.response.statusText,
            icon: 'error',
          });
        }
      } else {
        // Error network atau error lainnya yang tidak ada response
        Swal.fire({
          text: 'Network error or server did not respond',
          icon: 'error',
        });
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link className="btn btn-primary mb-2 float-end" to="/product/create">
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
                  {products.length > 0
                    ? products.map((row, key) => (
                        <tr key={key}>
                          <td>{row.title}</td>
                          <td>{row.description}</td>
                          <td>
                            <img
                              alt="product"
                              width="50px"
                              src={`http://localhost:8000/storage/product/image/${row.image}`}
                            />
                          </td>
                          <td>
                            <Link to={`/product/edit/${row.id}`} className="btn btn-success me-2">
                              Edit
                            </Link>
                            <Button variant="danger" onClick={() => deleteProduct(row.id)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan={4}>No products found.</td>
                      </tr>
                    )}
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
