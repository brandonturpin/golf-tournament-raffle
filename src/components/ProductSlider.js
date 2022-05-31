import { useState } from 'react';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import '../components/ProductSlider.css';
 
const ProductSlider = (props) => {
  const images = props.images;
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  }

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  }

  if(!Array.isArray(images) || images <= 0) {
    return null;
  }

  return (
    <section className="slider">
      <ArrowCircleLeftIcon className="arrow left-arrow" onClick={prevSlide} />
      <ArrowCircleRightIcon className="arrow right-arrow" onClick={nextSlide} />
      {images.map((image, index) => {
        return (
          <div className={ index === current ? 'slide-active' : 'active' } key={index}>
            {index === current && (
               <img src={image} alt="" className='sliderImage' />
            )}
          </div>
        )
      })}
    </section>
  );
}

export default ProductSlider;