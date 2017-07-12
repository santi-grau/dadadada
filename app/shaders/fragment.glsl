uniform float time;
uniform float ratio;
uniform vec2 resolution;
uniform float topVal[16];
uniform float botVal[16];
uniform sampler2D u_texture;

#define M_PI 3.14159265358979

vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P) {
	vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
	vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
	Pi = mod289(Pi);
	vec4 ix = Pi.xzxz;
	vec4 iy = Pi.yyww;
	vec4 fx = Pf.xzxz;
	vec4 fy = Pf.yyww;
	vec4 i = permute(permute(ix) + iy);
	vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
	vec4 gy = abs(gx) - 0.5 ;
	vec4 tx = floor(gx + 0.5);
	gx = gx - tx;
	vec2 g00 = vec2(gx.x,gy.x);
	vec2 g10 = vec2(gx.y,gy.y);
	vec2 g01 = vec2(gx.z,gy.z);
	vec2 g11 = vec2(gx.w,gy.w);
	vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
	g00 *= norm.x;
	g01 *= norm.y;
	g10 *= norm.z;
	g11 *= norm.w;
	float n00 = dot(g00, vec2(fx.x, fy.x));
	float n10 = dot(g10, vec2(fx.y, fy.y));
	float n01 = dot(g01, vec2(fx.z, fy.z));
	float n11 = dot(g11, vec2(fx.w, fy.w));
	vec2 fade_xy = fade(Pf.xy);
	vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
	float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
	return 2.3 * n_xy;
}

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv.y = 1.0 - uv.y;

	float q1 = 1.0;
	float q2 = 1.0;


	if( uv.x >= 0.0 && uv.x < 0.25 ){
		q1 = smoothstep(0.0,0.25,uv.x) * (topVal[4] - topVal[0]) + topVal[0];
		q2 = smoothstep(0.0,0.25,uv.x) * (botVal[4] - botVal[0]) + botVal[0];
	} else if( uv.x >= 0.25 && uv.x < 0.5 ){
		q1 = smoothstep(0.25,0.5,uv.x) * (topVal[8] - topVal[4]) + topVal[4];
		q2 = smoothstep(0.25,0.5,uv.x) * (botVal[8] - botVal[4]) + botVal[4];
	} else if( uv.x >= 0.5 && uv.x < 0.75 ){
		q1 = smoothstep(0.5,0.75,uv.x) * (topVal[12] - topVal[8]) + topVal[8];
		q2 = smoothstep(0.5,0.75,uv.x) * (botVal[12] - botVal[8]) + botVal[8];
	} else if( uv.x >= 0.75 && uv.x < 1.0 ){
		q1 = smoothstep(0.75,1.0,uv.x) * (topVal[15] - topVal[12]) + topVal[12];
		q2 = smoothstep(0.75,1.0,uv.x) * (botVal[15] - botVal[12]) + botVal[12];
	}

	// q1 = min( 1.0, max( 0.001, ( uv.x - 0.06 ) / ( 1.0 - 0.06 * 2.0 ) ) );
	// q2 = min( 1.0, max( 0.001, ( uv.x - 0.06 ) / ( 1.0 - 0.06 * 2.0 ) ) );

	float scale = resolution.y/resolution.x;


	// when no deformation
	// float def1 = scale;
	// float def2 = scale;

	// when q1 = 1 is ok, other values lack scale
	float def1 = ratio / ( ratio + ( 1.0 - ratio ) * q1 );
	float def2 = ratio / ( ratio + ( 1.0 - ratio ) * q2 );

	float a = 0.5 + uv.y * def1 - 0.5 * def1;
	float b = 0.5 + uv.y * def2 - 0.5 * def2;

	vec4 s1 = texture2D( u_texture, vec2( uv.x, a ) );
	if( uv.y > 0.5 ) s1 = texture2D( u_texture, vec2( uv.x, b ) );
	
	gl_FragColor = vec4( q1, s1.a, 0.0, 1.0 );
}