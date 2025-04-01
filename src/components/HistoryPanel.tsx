
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText, Trash2, Upload, Youtube } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryItem {
  id: number;
  type: string;
  title: string;
  content: string;
  date: string;
}

interface HistoryPanelProps {
  onClose: () => void;
  onSelectItem: (content: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose, onSelectItem }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    const savedHistory = localStorage.getItem('summaryHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  const handleSelectItem = (content: string) => {
    onSelectItem(content);
    onClose();
  };
  
  const handleClearHistory = () => {
    localStorage.removeItem('summaryHistory');
    setHistory([]);
  };
  
  const handleDeleteItem = (id: number) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('summaryHistory', JSON.stringify(updatedHistory));
  };
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'url':
        return <Upload className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">Summary History</h2>
        </div>
        
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
      
      {history.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No history yet. Start summarizing content to build your history.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <motion.div 
              key={item.id}
              className="border rounded-lg p-4 hover:bg-accent/10 cursor-pointer transition-colors"
              whileHover={{ scale: 1.01 }}
              onClick={() => handleSelectItem(item.content)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-muted rounded-full">
                    {getIconForType(item.type)}
                  </span>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.date), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPanel;
