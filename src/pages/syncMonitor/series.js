import {PieData} from "./pieData";

/**
 * created by anran on 2020-02-25.
 */
export const Series=[
	{
		type: 'pie',
		id: 'pie',
		radius: '60%',
		hoverAnimation: true,
		legendHoverLink:false,
		center: ['20%', '50%'],
		selectedMode: 'single',
		label: {
			normal:{
				show:false,
			}
		},
		data: PieData,
	},
];
