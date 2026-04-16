import { motion } from 'framer-motion';
import type { Testimonial } from '../../types/common';

interface VideoCardProps {
  data: Testimonial;
}

const VideoCard = ({ data }: VideoCardProps) => {
  const youtubeId =
    data.type === 'video' && data.media_url
      ? (data.media_url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        )?.[1] ?? null)
      : null;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div>
        <h3>{data.title}</h3>
      </div>
      {youtubeId && (
        <motion.div
          className="relative rounded-lg overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="aspect-video relative">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={data.media_description ?? 'Video testimonial'}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoCard;
