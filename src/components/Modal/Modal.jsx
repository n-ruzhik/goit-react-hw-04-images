import { useEffect } from 'react';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';
import css from './Modal.module.css';

export default function Modal({ onClose, children }) {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  //   componentDidMount() {
  //     window.addEventListener('keydown', this.handleKeyDown);
  //   }

  //   componentWillUnmount() {
  //     window.removeEventListener('keydown', this.handleKeyDown);
  //   }

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.content}>
        <button type="button" className={css.closeButton} onClick={onClose}>
          <CloseIcon
            width="20"
            height="20"
            fill="#1DA1F2"
            className={css.closeIcon}
          />
        </button>
        {children}
      </div>
    </div>
    //  modalRoot
  );
}
