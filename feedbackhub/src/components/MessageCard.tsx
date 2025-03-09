'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Trash2, Clock, MessageSquare, Calendar, Shield } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const formattedDate = dayjs(message.createdAt).format('MMM D, YYYY h:mm A');
  const relativeDate = dayjs(message.createdAt).fromNow();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } 
  };

  return (
    <Card className="group border border-gray-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md bg-white rounded-xl overflow-hidden border-l-4 border-l-blue-400">
      <CardHeader className="pb-2 pt-4 px-5 bg-gradient-to-r from-blue-50/50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 
                    {relativeDate}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-white">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-300" />
                    <p>{formattedDate}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 text-[10px]">
              {formattedDate}
            </Badge>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-lg border-gray-200 shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" /> Delete this message?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-200 hover:bg-gray-50 hover:text-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      <CardContent className="px-5 py-4">
        <div className="flex">
          <div className="flex-shrink-0 mr-4 mt-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="flex-grow">
            <blockquote className="text-gray-800 whitespace-pre-wrap leading-relaxed border-l-2 border-blue-200 pl-4 italic">
              {message.content}
            </blockquote>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="py-3 px-5 bg-gradient-to-r from-blue-50/30 to-white border-t border-gray-100">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-100">
              <Shield className="w-3 h-3 mr-1.5" />
              Anonymous
            </div>
            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              Verified
            </div>
          </div>
          <div className="text-xs font-medium text-gray-600 bg-gray-100 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors border border-gray-200 flex items-center gap-1">
            <span className="text-blue-500">#</span>
            {message._id.substring(0, 6)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}