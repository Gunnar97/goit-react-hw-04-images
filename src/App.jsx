import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import { SearchBar } from 'components/SearchBar/SearchBar';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getData } from 'helper/api';
import { PER_PAGE } from 'utils/constants';
import { Modal } from 'components/Modal/Modal';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'components/Button/Button';

export const App = () => {
  const [formData, setFormData] = useState({
    modal: {
      currentImage: '',
      isOpen: false,
      tags: '',
    },
    images: [],
    page: 1,
    q: '',
    loading: false,
  });

  const prevFormData = useRef(formData);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const { page, q } = formData;
      if (prevFormData.current.page !== page || prevFormData.current.q !== q) {
        setFormData(prevFormData => ({ ...prevFormData, loading: true }));
        try {
          const { hits, totalHits } = await getData({ q, page });
          if (isMounted) {
            setFormData(prevFormData => ({
              ...prevFormData,
              images: [...prevFormData.images, ...hits],
              totalHits,
              loading: false,
            }));
            if (!totalHits) {
              throw new Error(
                'Ничего не найдено. Пожалуйста, попробуйте другой запрос'
                // 123
              );
            }
            toast.success(
              `Показано ${
                PER_PAGE * page <= totalHits ? PER_PAGE * page : totalHits
              } изображений из ${totalHits}`,
              {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                theme: 'colored',
              }
            );
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [formData.q, formData.page]);

  const setQuery = q => {
    setFormData({ ...formData, q, page: 1, images: [] });
  };

  const handleModal = (img, tags) => {
    setFormData(prevFormData => ({
      ...formData,
      modal: {
        isOpen: !prevFormData.modal.isOpen,
        currentImage: img,
        tags,
      },
    }));
  };

  const handleLoadMore = () => {
    setFormData(prev => ({ ...formData, page: prev.page + 1 }));
  };

  const {
    images,
    modal: { isOpen, currentImage, tags },
    loading,
    totalHits,
  } = formData;

  return (
    <div className="app">
      <SearchBar setQuery={setQuery} />
      {images.length ? (
        <>
          {loading && !images.length && <Loader />}
          <ImageGallery
            imagesToView={images}
            modalStatus={isOpen}
            handleModal={handleModal}
          />
          {images.length < totalHits && (
            <Button type="button" onClick={handleLoadMore}>
              {loading ? 'Loading...' : 'Load more'}
            </Button>
          )}
        </>
      ) : null}

      {isOpen && (
        <Modal onCloseModal={handleModal}>
          <img src={currentImage} alt={tags} />
        </Modal>
      )}
    </div>
  );
};
