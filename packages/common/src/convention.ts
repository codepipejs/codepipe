export class NameConvention {
	constructor(){
		throw new Error('Singleton class, cannot be instantiated');
	}

	static readonly LAYER_ATTRIBUTE_NAME = 'layer';

	static readonly KEY_ATTRIBUTE_NAME = '$key';
}