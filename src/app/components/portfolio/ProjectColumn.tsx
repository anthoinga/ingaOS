import type { Project } from '@/app/types';
import { ProjectTile } from './ProjectTile';
import { SPACING } from '@/app/data/constants';

interface ProjectColumnProps {
  projects: Project[];
  children?: React.ReactNode;
}

export function ProjectColumn({ projects, children }: ProjectColumnProps) {
  return (
    <div
      className="column flex flex-col"
      style={{ gap: `${SPACING.tileGap}px` }}
    >
      {projects.map((project) => (
        <ProjectTile key={project.id} {...project} />
      ))}
      {children}
    </div>
  );
}
