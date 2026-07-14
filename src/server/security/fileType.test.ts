import { describe, it, expect } from 'vitest';
import { sniff, IMAGE_TYPES, VIDEO_TYPES } from './fileType';

/** Build a header buffer from a signature, padded so length checks pass. */
const buf = (...bytes: number[]) => new Uint8Array([...bytes, ...new Array(16).fill(0)]);

describe('sniff — identifies a file by its magic bytes, not its claimed type', () => {
  it('accepts real image signatures', () => {
    expect(sniff(buf(0xff, 0xd8, 0xff, 0xe0))).toBe('jpeg');
    expect(sniff(buf(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe('png');
    expect(sniff(buf(0x47, 0x49, 0x46, 0x38))).toBe('gif');
    // RIFF....WEBP
    expect(sniff(buf(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50))).toBe('webp');
  });

  it('accepts a real PDF', () => {
    expect(sniff(buf(0x25, 0x50, 0x44, 0x46, 0x2d))).toBe('pdf'); // %PDF-
  });

  it('accepts real video containers via the ftyp brand', () => {
    // ....ftypisom → mp4 family
    expect(sniff(buf(0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d))).toBe('mp4');
    // ....ftypqt   → quicktime .mov
    expect(sniff(buf(0, 0, 0, 0x14, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20))).toBe('mov');
    // EBML → webm
    expect(sniff(buf(0x1a, 0x45, 0xdf, 0xa3))).toBe('webm');
  });

  it('REJECTS an executable/script that lies about being an image', () => {
    expect(sniff(new TextEncoder().encode('<?php system($_GET[1]); ?>'))).toBeNull();
    expect(sniff(new TextEncoder().encode('<!DOCTYPE html><script>evil()</script>'))).toBeNull();
    expect(sniff(new TextEncoder().encode('#!/bin/sh\nrm -rf /'))).toBeNull();
  });

  it('rejects a too-short buffer rather than guessing', () => {
    expect(sniff(new Uint8Array([0xff, 0xd8]))).toBeNull();
  });

  it('classifies its own results into the image/video allow-lists', () => {
    expect(IMAGE_TYPES).toContain('jpeg');
    expect(VIDEO_TYPES).toContain('mp4');
    expect(IMAGE_TYPES).not.toContain('pdf');
    expect(VIDEO_TYPES).not.toContain('jpeg');
  });
});
