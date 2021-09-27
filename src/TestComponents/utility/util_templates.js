import React from 'react';
import { TemplateItem } from './util_templateItem';
export const UtilTemplates = (props) => {
	return (
		<div>
			{props.attribute.length === 0 ? (
				'No' + props.name + 'to display'
			) : (
				props.attribute.map((attr) => {
					return <TemplateItem attr={attr} key={attr.id} name = {props.name}/>;
				})
			)}
		</div>
	);
};
