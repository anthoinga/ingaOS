import { Project } from '@/app/types';
import { ProjectColumn } from './ProjectColumn';
import { SpotifyWidget } from '@/app/components/widgets/SpotifyWidget';
import { nowPlaying } from '@/app/data/music';
import { SPACING } from '@/app/data/constants';

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  // Redistribute projects into 3 columns
  const column1: Project[] = [];
  const column2: Project[] = [];
  const column3: Project[] = [];

  if (projects && Array.isArray(projects)) {
    projects.forEach((project, index) => {
      const columnIndex = index % 3;
      if (columnIndex === 0) column1.push(project);
      else if (columnIndex === 1) column2.push(project);
      else column3.push(project);
    });
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
      style={{ gap: `${SPACING.tileGap}px` }}
    >
      <ProjectColumn projects={column1} />
      <ProjectColumn projects={column2} />
      <ProjectColumn projects={column3}>
        <SpotifyWidget nowPlaying={nowPlaying} />
      </ProjectColumn>
    </div>
  );
}
