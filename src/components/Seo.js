import { useEffect } from 'react';

const DESCRIPTION_SELECTOR = 'meta[name="description"]';

const Seo = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    let descriptionTag = document.querySelector(DESCRIPTION_SELECTOR);

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', description || '');
  }, [description, title]);

  return null;
};

export default Seo;
