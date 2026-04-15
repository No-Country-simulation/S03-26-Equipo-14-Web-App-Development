import { useEffect, useState } from 'react';
import type { Testimonial, TestimonialType } from '../types/common';

interface useFetchTestimonialsProps {
  apiKey?: string;
  type?: TestimonialType;
}

const useFetchTestimonials = ({ apiKey, type }: useFetchTestimonialsProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      if (!apiKey) return;
      let url =
        'https://s03-26-equipo-14-web-app-development.onrender.com/embed';
      if (type) {
        url += `?type=${type}`;
      }

      const result = await fetch(url, {
        method: 'Get',
        headers: {
          'x-embed-key': apiKey,
        },
      });
      const response = await result.json();
      if (response.success) setIsLoading(false);
      setTestimonials(response.data);
    };

    fetchTestimonials();
  }, []);
  return {
    testimonials,
    isLoading,
  };
};

export default useFetchTestimonials;