import React from 'react';
import { ProjectItem } from './project_item';
export class Projects extends React.Component {
	constructor(props) {
		super(props);
		console.log('Inside projects');
	}
	render() {
		if (!this.props.projects) {
			return <div>Loading projects...</div>;
		}

		return (
			<div>
				{this.props.projects.length === 0 ? (
					'No Projects to display'
				) : (
					this.props.projects.map((project) => {
						return <ProjectItem project={project} key={project.id} />;
					})
				)}
			</div>
		);
	}
}
