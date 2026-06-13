// 1) Custom Stisla bundle compiled from Sass source (subset of components).
import './styles/stisla.scss';

// 2) Runtime token overrides — applied after the bundle so they win
//    via specificity-equal source order.
import './styles/overrides.css';

// 3) Vanilla bundle — Stisla auto-scans on DOMContentLoaded.
//    We could go à la carte here too, but for the smoke a core import
//    is enough.
import '@stisla/vanilla';
