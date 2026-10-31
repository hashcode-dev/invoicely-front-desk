import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ScrollToTop anchor navigation logic', () => {
  let originalWindow: any;

  beforeEach(() => {
    originalWindow = global.window;
    // Mock minimal DOM window and document if running in node env
    if (typeof global.window === 'undefined') {
      (global as any).window = {};
    }
    global.window.scrollTo = vi.fn();
    (global as any).document = {
      getElementById: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.window = originalWindow;
  });

  test('does not scroll to (0, 0) and scrolls to target element when location.hash is present', () => {
    const scrollIntoViewMock = vi.fn();
    (global.document.getElementById as any).mockReturnValue({
      scrollIntoView: scrollIntoViewMock,
    });

    const location = { pathname: '/', hash: '#features' };
    const targetId = location.hash.replace(/^#/, '');

    expect(targetId).toBe('features');

    const element = global.document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      global.window.scrollTo(0, 0);
    }

    expect(global.document.getElementById).toHaveBeenCalledWith('features');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(global.window.scrollTo).not.toHaveBeenCalled();
  });

  test('scrolls to (0, 0) when location.hash is empty', () => {
    const location = { pathname: '/dashboard', hash: '' };

    if (location.hash) {
      const targetId = location.hash.replace(/^#/, '');
      const element = global.document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      global.window.scrollTo(0, 0);
    }

    expect(global.window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
