/**
 * created by anran on 2020-02-25.
 */
import { PieData } from './pieData';

export const a = 2;
export const Legend = [
	{
		orient: 'vertical',
		right: 10,
		top: 40,
		icon: 'circle',
		itemWidth: 8,
		formatter(name) {
			let legendEnd;
			let compareCount;
			let count;
			for (let i = 0; i < PieData.length; i += 1) {
				if (PieData[i].name === name) {
					count = PieData[i].value;
					compareCount = PieData[i].sourceCompare;
					legendEnd = `{a|${name}}  {b|${count}}  条  ${compareCount < 0 ? '少' : '多'}  {c|${compareCount}}  条`;
				}
			}
			return legendEnd;
		},
		textStyle: {
			color: '#9e9e9e',
			fontSize: 14,
			rich: {
				a: {
					color: '#0099CC',
					fontSize: 14,
					width: 50,
				},
				b: {
					fontWeight: 'bold',
					fontSize: 16,
					color: '#293038',
					padding: [0, 0, 0, 100],
				},
				c: {
					fontWeight: 'bold',
					fontSize: 16,
					color: '#293038',
				},
			},
		},
	},
];
