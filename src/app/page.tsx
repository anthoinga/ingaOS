'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { ProjectGrid } from '@/app/components/portfolio/ProjectGrid';
import { ChatInterface } from '@/app/components/chat/ChatInterface';
import { executeFilter } from '@/app/utils/filterEngine';
import { generateFilterResponse } from '@/app/utils/responseGenerator';
import { allProjects } from '@/app/data/projects';
import { SPACING, COLORS } from '@/app/data/constants';
import { useLanguage } from '@/app/i18n/LanguageContext';

export default function HomePage() {
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [gridVisible, setGridVisible] = useState(true);
  const { t, language } = useLanguage();

  const headerInfo = {
    name: 'INGA.DEV',
    //title: 'Software Designer, Creative Technologist',
    location: t.location,
  };

  const footerInfo = {
    name: 'Inga',
    copyright: t.copyright,
    tagline: t.tagline,
  };

  // Load queryCount from sessionStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const saved = sessionStorage.getItem('chatQueryCount');
    if (saved) {
      setQueryCount(parseInt(saved, 10));
    }
  }, []);

  // Save queryCount to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('chatQueryCount', queryCount.toString());
    }
  }, [queryCount]);

  // Content protection - disable right-click, drag, and save-as
  useEffect(() => {
    // Prevent context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent drag start on images and other elements
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent save-as shortcuts (Ctrl+S, Cmd+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleQuery = async (query: string) => {
    console.log('handleQuery called with:', query);
    setIsLoading(true);

    try {
      // Step 1: Client-side filtering (keep this - it's fast)
      console.log('Executing filter with allProjects:', allProjects.length);
      const filterResult = executeFilter(query, allProjects);
      console.log('Filter result:', filterResult);

      // Step 2: Call AI API with filtered context
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          matchedProjects: filterResult.matchedProjects.map(id =>
            allProjects.find(p => p.id === id)
          ).filter(Boolean), // Remove any undefined entries
          allProjectsCount: allProjects.length,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const { response: aiResponse } = await response.json();

      // Step 3: Update UI — fade out, swap content, fade in
      const newIds = filterResult.matchedProjects.length > 0 ? filterResult.matchedProjects : null;
      setGridVisible(false);
      setTimeout(() => {
        setFilteredIds(newIds);
        setResponse(aiResponse);
        setQueryCount(prev => prev + 1);
        setGridVisible(true);
      }, 180);
    } catch (error) {
      console.error('Query error:', error);
      // Fallback to template-based response if AI fails
      try {
        const filterResult = executeFilter(query, allProjects);
        const result = generateFilterResponse(filterResult, allProjects, language);
        const newIds = result.matchedProjects.length > 0 ? result.matchedProjects : null;
        setGridVisible(false);
        setTimeout(() => {
          setFilteredIds(newIds);
          setResponse(result.response);
          setQueryCount(prev => prev + 1);
          setGridVisible(true);
        }, 180);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setResponse(t.errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGridVisible(false);
    setTimeout(() => {
      setFilteredIds(null);
      setResponse(null);
      setGridVisible(true);
    }, 180);
  };

  const handleReset = () => {
    setGridVisible(false);
    setTimeout(() => {
      setFilteredIds(null);
      setResponse(null);
      setGridVisible(true);
    }, 180);
  };

  const filteredProjects = useMemo(() => {
    if (!filteredIds) return allProjects;
    return allProjects.filter(p => filteredIds.includes(p.id));
  }, [filteredIds]);

  return (
    <div
      className="min-h-screen flex flex-col px-4 md:px-8 lg:px-[30px] select-none"
      style={{
        backgroundColor: COLORS.background,
        paddingTop: `${SPACING.containerPadding}px`,
        paddingBottom: `${SPACING.containerPadding}px`,
        gap: `${SPACING.tileGap}px`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      <Header {...headerInfo} onReset={handleReset} />
      <div style={{ opacity: gridVisible ? 1 : 0, transition: 'opacity 0.18s ease-out' }}>
        <ProjectGrid projects={filteredProjects} />
      </div>
      <Footer {...footerInfo} />

      <ChatInterface
        onQuery={handleQuery}
        response={response}
        isLoading={isLoading}
        onClose={handleClose}
        queryCount={queryCount}
      />
    </div>
  );
}
