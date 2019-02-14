export enum ExpressionType {
	Literal       = '[Expression] Literal',
	Layer         = '[Expression] Layer',
	Interpolation = '[Expression] Interpolation'
}

export enum DirectiveType {
	None   = '[Directive] None',
	Auto   = '[Directive] Auto',
	Inject = '[Directive] Inject'
}

export enum InterpolationType {
	LiteralValue     = '[Interpolation] Literal value',
	ObjectValue      = '[Interpolation] Object value',
	Iteration        = '[Interpolation] Iteration',
	IterationObjects = '[Interpolation] Iteration objects',
	InterationByKey  = '[Interpolation] Interation by Key'
}