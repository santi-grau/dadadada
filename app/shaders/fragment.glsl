uniform float time;
uniform vec2 resolution;
uniform sampler2D u_texture;
// varying vec2 vUv;

// uniform float time;
// uniform sampler2D logo;
// uniform sampler2D waveForm;

// #define M_PI 3.14159265358979

// vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
// vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
// vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
// vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0);}

// float cnoise(vec2 P) {
// 	vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
// 	vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
// 	Pi = mod289(Pi);
// 	vec4 ix = Pi.xzxz;
// 	vec4 iy = Pi.yyww;
// 	vec4 fx = Pf.xzxz;
// 	vec4 fy = Pf.yyww;
// 	vec4 i = permute(permute(ix) + iy);
// 	vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
// 	vec4 gy = abs(gx) - 0.5 ;
// 	vec4 tx = floor(gx + 0.5);
// 	gx = gx - tx;
// 	vec2 g00 = vec2(gx.x,gy.x);
// 	vec2 g10 = vec2(gx.y,gy.y);
// 	vec2 g01 = vec2(gx.z,gy.z);
// 	vec2 g11 = vec2(gx.w,gy.w);
// 	vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
// 	g00 *= norm.x;
// 	g01 *= norm.y;
// 	g10 *= norm.z;
// 	g11 *= norm.w;
// 	float n00 = dot(g00, vec2(fx.x, fy.x));
// 	float n10 = dot(g10, vec2(fx.y, fy.y));
// 	float n01 = dot(g01, vec2(fx.z, fy.z));
// 	float n11 = dot(g11, vec2(fx.w, fy.w));
// 	vec2 fade_xy = fade(Pf.xy);
// 	vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
// 	float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
// 	return 2.3 * n_xy;
// }

	
// float smin( float a, float b, float k ){
// 	float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
// 	return mix( b, a, h ) - k*h*(1.0-h);
// }

void main( void ) {
	// float ratio = 0.199951171875;

	// vec4 w = texture2D( waveForm, vUv );

	// float q = 0.0;
	// q = w.r;

	// float q2 = 0.0;
	// q2 = w.g;


	// if( vUv.x < 0.5 ){
	// 	vec4 s1 = texture2D( waveForm, vec2( 0.0, 0.5 ) );
	// 	vec4 s2 = texture2D( waveForm, vec2( 0.5, 0.5 ) );

	// 	float m = mix( s1.g, s2.g, vUv.x );
	// 	q = m;
	// }

	// if( vUv.x >= 0.5 ){
	// 	vec4 s1 = texture2D( waveForm, vec2( 0.5, 0.5 ) );
	// 	vec4 s2 = texture2D( waveForm, vec2( 1.0, 0.5 ) );

	// 	float m = mix( s1.g, s2.g, vUv.x );
	// 	q = m;
	// }
	



	// vec4 l = texture2D( logo, vec2( vUv.x, ( vUv.y - 0.5 ) * ( ratio + ( 1.0 - q ) * ( 1.0 - q ) ) + 0.5 ) );
	// if( vUv.y > 0.5 ) l = texture2D( logo, vec2( vUv.x, ( vUv.y - 0.5 ) * ( ratio + ( 1.0 - q2 ) * ( 1.0 - q2 ) ) + 0.5 ) );

	// gl_FragColor = vec4( vUv.x , 0.0 , l.a , 1.0 );
	
 	
 	

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv.y = 1.0 - uv.y;

	vec4 s1 = texture2D( u_texture, uv );

	gl_FragColor = vec4( s1.a, s1.a, s1.a, s1.a );
 
			


	// gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}