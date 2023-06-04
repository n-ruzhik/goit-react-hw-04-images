import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from 'components/Searchbar';
import api from '../services/PixabyApiService';
import ImageGallery from 'components/ImageGallery';
import Modal from 'components/Modal';
import Loader from 'components/Loader';
import Button from 'components/Button';

import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [urlModal, setUrlModal] = useState('');
  const [onLoading, setOnLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    setOnLoading(true);

    api
      .fetchImage(query, page)
      .then(({ hits, totalHits }) => {
        if (!hits.length) {
          setIsEmpty(true);
          return;
        }
        setImages(images => [...images, ...hits]);
        setShowBtn(() => page < Math.ceil(totalHits / 12));
      })
      .catch(error => {
        setError(`${error}`);
      })
      .finally(() => setOnLoading(false));
  }, [query, page]);

  const openModal = url => {
    setShowModal(!showModal);
    setUrlModal(url);
  };

  const closeModal = () => {
    setShowModal(!showModal);
    setUrlModal('');
  };

  const toggleOnLoading = () => {
    setOnLoading(onLoading => !onLoading);
  };

  const handleFormSubmit = query => {
    setImages([]);
    setQuery(query);
    setPage(1);
    setShowBtn(false);
    setError('');
    setIsEmpty(false);
  };

  const handleIncrement = () => {
    setPage(page => page + 1);
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      <div>
        {isEmpty && (
          <p className={css.error}>Sorry, nothing found for your request</p>
        )}
        {error && <p className={css.error}>{error}</p>}
        <>
          <ImageGallery
            images={images}
            openModal={openModal}
            toggleOnLoading={toggleOnLoading}
          />
          {showBtn && <Button handleIncrement={handleIncrement} />}
        </>

        {onLoading && <Loader />}
      </div>
      {showModal && (
        <Modal onClose={closeModal}>
          <img
            onLoad={toggleOnLoading}
            src={urlModal}
            alt=""
            width="900px"
            height="600px"
            className={css.modalImage}
          />
        </Modal>
      )}
      <ToastContainer autoClose={1500} />
    </div>
  );
}
