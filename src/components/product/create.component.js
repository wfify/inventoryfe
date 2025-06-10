import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [validationError, setValidationError] = useState({});

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const createProduct = async (e) => {
    e.preventDefault();

    // Jika tidak ada gambar, jangan lanjut
    if (!image) {
      Swal.fire({
        icon: 'error',
        text: 'Please select an image',
      });
      return;
    }

    const payload = {
      title,
      description,
      image: image.name, // hanya nama file, bukan file-nya
    };

    try {
      setLoading(true);
      const { data } = await axios.post(`https://inventoryjs-three.vercel.app/products`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      Swal.fire({
        icon: 'success',
        text: data?.message || 'Product created successfully',
      });
      navigate('/');
    } catch (error) {
      const response = error.response;
      if (response?.status === 404 || response?.status === 500) {
        navigate('/');
      } else if (response?.status === 422) {
        setValidationError(response.data.errors);
      } else {
        Swal.fire({
          icon: 'error',
          text: response?.data?.message || 'An error occurred',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create Product</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(([key, value]) => (
                            <li key={key}>{value}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={createProduct}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={title}
                          onChange={(event) => setTitle(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          required
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={changeHandler} required />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button disabled={loading} variant="primary" className="mt-2" size="lg" type="submit">
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
