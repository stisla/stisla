const breakpoints = {
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200
}

const mediaBreakpointUp = (breakpoint) => {
	const windowWidth = window.outerWidth;

	if(windowWidth >= breakpoints[breakpoint]) {
		return true;
	}
}

const mediaBreakpointDown = (breakpoint) => {
	const windowWidth = window.outerWidth;

	if(windowWidth <= breakpoints[breakpoint]) {
		return true;
	}
}

export {breakpoints, mediaBreakpointUp, mediaBreakpointDown}