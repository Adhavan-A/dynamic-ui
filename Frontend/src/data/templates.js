import { newElement } from '../lib/constants';

export const TEMPLATES = [
  {
    name: 'Floating Action Button',
    desc: 'A gradient circular button with a gentle float animation.',
    emoji: '🚀',
    build() {
      const b = newElement('button', 150, 90);
      b.w = 64; b.h = 64;
      b.styles = { ...b.styles, bg: '#8B5CF6', color: '#fff', radius: 32, fontSize: 22, shadow: 'strong' };
      b.content = '↑';
      b.animation = { type: 'float', duration: 3, delay: 0, iteration: 1, infinite: true, easing: 'ease-in-out' };
      return [b];
    },
  },
  {
    name: 'Animated Pricing Card',
    desc: 'Glass pricing card that scales in on load.',
    emoji: '💳',
    build() {
      const c = newElement('card', 170, 130);
      c.w = 240; c.h = 260;
      c.styles = { ...c.styles, bg: 'rgba(139,92,246,0.10)', radius: 18, shadow: 'strong' };
      c.animation = { type: 'scale', duration: 0.8, delay: 0, iteration: 1, infinite: false, easing: 'ease-out' };

      const h = newElement('heading', 290, 60);
      h.w = 180; h.h = 40; h.content = 'Pro Plan';
      h.styles.fontSize = 22;
      h.animation = { type: 'fadein', duration: 0.6, delay: 0.3, iteration: 1, infinite: false, easing: 'ease-out' };

      const btn = newElement('button', 290, 260);
      btn.w = 160; btn.h = 44; btn.content = 'Get Started';
      btn.animation = { type: 'slidebottom', duration: 0.6, delay: 0.5, iteration: 1, infinite: false, easing: 'ease-out' };

      return [c, h, btn];
    },
  },
  {
    name: 'Fade-in Hero Banner',
    desc: 'Large heading and subtext that fade in on load.',
    emoji: '🌅',
    build() {
      const h = newElement('heading', 220, 60);
      h.w = 360; h.h = 60; h.content = 'Welcome to the Future';
      h.styles.fontSize = 34;
      h.animation = { type: 'fadein', duration: 1, delay: 0, iteration: 1, infinite: false, easing: 'ease-out' };

      const t = newElement('text', 220, 120);
      t.w = 360; t.h = 50; t.content = 'Build stunning interfaces in minutes, not hours.';
      t.animation = { type: 'fadein', duration: 1, delay: 0.3, iteration: 1, infinite: false, easing: 'ease-out' };

      return [h, t];
    },
  },
  {
    name: 'Bouncy Notification',
    desc: 'A card that bounces in to grab attention.',
    emoji: '🔔',
    build() {
      const c = newElement('card', 170, 90);
      c.w = 260; c.h = 90;
      c.styles = { ...c.styles, bg: 'rgba(34,211,238,0.12)', radius: 14 };
      c.animation = { type: 'bounce', duration: 1, delay: 0, iteration: 1, infinite: true, easing: 'ease-in-out' };

      const t = newElement('text', 300, 90);
      t.w = 220; t.h = 50; t.content = '🎉 New message received!';
      t.styles.color = '#22D3EE';
      t.animation = { type: 'bounce', duration: 1, delay: 0, iteration: 1, infinite: true, easing: 'ease-in-out' };

      return [c, t];
    },
  },
  {
    name: 'Typing Hero Text',
    desc: 'Headline that types itself out character by character.',
    emoji: '⌨️',
    build() {
      const h = newElement('heading', 220, 70);
      h.w = 380; h.h = 50; h.content = 'Building the future, one pixel at a time.';
      h.styles.fontSize = 24;
      h.animation = { type: 'typing', duration: 1, delay: 0, iteration: 1, infinite: false, easing: 'linear' };
      return [h];
    },
  },
  {
    name: 'Slide-in Sidebar Card',
    desc: 'Card that slides in from the left with an image and label.',
    emoji: '📇',
    build() {
      const img = newElement('image', 130, 110);
      img.w = 160; img.h = 110;
      img.animation = { type: 'slideleft', duration: 0.7, delay: 0, iteration: 1, infinite: false, easing: 'ease-out' };

      const t = newElement('text', 130, 180);
      t.w = 180; t.h = 40; t.content = 'Discover new places';
      t.animation = { type: 'slideleft', duration: 0.7, delay: 0.15, iteration: 1, infinite: false, easing: 'ease-out' };

      return [img, t];
    },
  },
];
