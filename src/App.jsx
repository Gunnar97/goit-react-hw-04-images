import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import { SearchBar } from 'components/SearchBar/SearchBar';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getData } from 'helper/api';
import { PER_PAGE } from 'utils/constants';
import { Modal } from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [modal, setModal] = useState({
    currentImage: '',
    isOpen: false,
    tags: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      if (!q && page === 1) return;
      try {
        const { hits, totalHits } = await getData({ q, page });
        if (isMounted) {
          setImages(prev => [...prev, ...hits]);
          setTotalHits(totalHits);

          if (!totalHits) {
            throw new Error(
              'Ничего не найдено. Пожалуйста, попробуйте другой запрос'
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
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [q, page]);

  const setQuery = query => {
    if (q !== query) {
      setPage(1);
      setImages([]);
      setQ(query);
    }
  };

  const handleModal = (img, tags) => {
    setModal({
      currentImage: img,
      isOpen: !isOpen,
      tags,
    });
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const { currentImage, isOpen, tags } = modal;
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
