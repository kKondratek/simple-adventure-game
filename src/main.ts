import Phaser from 'phaser'

import MainScene from './scenes/MainScene'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';


const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [MainScene],
	plugins: {
		scene: [{
			key: 'rexUI',
			plugin: UIPlugin,
			start: true,
			mapping: 'rexUI'
		}]
	}
};

export default new Phaser.Game(config)
