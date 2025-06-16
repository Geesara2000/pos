import { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';


const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct } = usePOS();

  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    barcode: product?.barcode || '',
    category: product?.category || '',
    description: product?.description || '',
    image: null // for new file input
  });

  const [previewImage, setPreviewImage] = useState(
    product?.image ? `http://127.0.0.1:8000${product.image}` : '/default_product.png'
  );

  // handle text input change
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', parseFloat(formData.price));
    data.append('quantity', parseInt(formData.quantity));
    data.append('barcode', formData.barcode);
    data.append('category', formData.category);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    if (product) {
      updateProduct(product.id, data);
    } else {
      addProduct(data);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Upload and Preview */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={previewImage}
              alt="Product Preview"
              className="w-24 h-24 object-cover border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter product name"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter category"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
            placeholder="0.00"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            required
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
          />
        </div>

        {/* Barcode */}
        <div className="md:col-span-2">
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
            Barcode *
          </label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            required
            value={formData.barcode}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter barcode"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter product description"
          />
        </div>
      </div>

      {/* Form buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
