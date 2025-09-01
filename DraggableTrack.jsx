import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Music, 
  Clock, 
  GripVertical,
  X
} from 'lucide-react';

const ItemTypes = {
  TRACK: 'track'
};

const DraggableTrack = ({ 
  track, 
  index, 
  moveTrack, 
  isPlaying = false, 
  onPlay, 
  onRemove 
}) => {
  const ref = useRef(null);
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TRACK,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Set up drop target
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.TRACK,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      moveTrack(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  
  // Initialize drag and drop refs
  drag(drop(ref));
  
  return (
    <div 
      ref={ref}
      className={`flex items-center p-4 border-b hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50 bg-gray-50' : ''
      } ${isPlaying ? 'bg-indigo-50' : ''}`}
      data-handler-id={handlerId}
    >
      {/* Drag Handle */}
      <div className="cursor-move mr-2 text-gray-400 hover:text-gray-600">
        <GripVertical className="h-5 w-5" />
      </div>
      
      {/* Track Icon */}
      <div className="h-10 w-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-md flex items-center justify-center mr-4">
        <Music className="h-5 w-5 text-indigo-400" />
      </div>
      
      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
        <div className="flex items-center text-xs text-gray-500">
          <Badge variant="outline" className="mr-2 text-xs capitalize">
            {track.category}
          </Badge>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(track.duration)}
          </span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-2">
        <Button 
          size="icon" 
          variant={isPlaying ? "default" : "outline"}
          className="rounded-full h-8 w-8"
          onClick={() => onPlay && onPlay(track)}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost"
          className="rounded-full h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
          onClick={() => onRemove && onRemove(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DraggableTrack;

