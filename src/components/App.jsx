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

  // onRenderImages(query, page) {
  //   this.setState({
  //     onLoading: true,
  //   });

  //   api
  //     .fetchImage(query, page)
  //     .then(({ hits, totalHits }) => {
  //       if (!hits.length) {
  //         this.setState({
  //           isEmpty: true,
  //         });
  //         return;
  //       }
  //       this.setState({
  //         images: [...this.state.images, ...hits],
  //         showBtn: this.state.page < Math.ceil(totalHits / 12),
  //       });
  //     })
  //     .catch(error => {
  //       this.setState({ error: `${error}` });
  //     })
  //     .finally(() => this.setState({ onLoading: false }));
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   const newQuery = this.state.query;
  //   const newPage = this.state.page;

  //   if (
  //     prevState.query !== this.state.query ||
  //     prevState.page !== this.state.page
  //   ) {
  //     this.onRenderImages(newQuery, newPage);
  //   }
  // }

  // openModal = url => {
  //   this.setState(({ showModal }) => ({
  //     showModal: !showModal,
  //     urlModal: url,
  //   }));
  // };

  // closeModal = () => {
  //   this.setState(({ showModal }) => ({
  //     showModal: !showModal,
  //     urlModal: '',
  //   }));
  // };

  const toggleOnLoading = () => {
    setOnLoading(!onLoading);
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

  // toggleOnLoading = () => {
  //   this.setState(({ onLoading }) => ({ onLoading: !onLoading }));
  // };

  // handleFormSubmit = query => {
  //   this.setState({
  //     images: [],
  //     query,
  //     page: 1,
  //     showBtn: false,
  //     total: 'null',
  //     error: '',
  //     isEmpty: false,
  //   });
  // };

  // handleIncrement = () => {
  //   this.setState(({ page }) => ({
  //     page: page + 1,
  //   }));
  // };

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
