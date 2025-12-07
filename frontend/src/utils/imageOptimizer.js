// frontend/src/utils/imageOptimizer.js

/**
 * Utility untuk optimasi gambar dari Supabase Storage
 * Menggunakan Supabase Image Transformation API
 */

/**
 * Mengoptimasi URL gambar Supabase dengan transformasi
 * @param {string} url - URL gambar asli dari Supabase
 * @param {object} options - Opsi transformasi
 * @param {number} options.width - Lebar gambar (default: 400)
 * @param {number} options.height - Tinggi gambar (optional)
 * @param {string} options.quality - Kualitas gambar: 'low' | 'medium' | 'high' (default: 'medium')
 * @param {string} options.format - Format output: 'webp' | 'jpg' | 'png' (default: 'webp')
 * @returns {string} URL gambar yang sudah dioptimasi
 */
export function optimizeSupabaseImage(url, options = {}) {
  // TEMPORARY FIX: Supabase Image Transformation mungkin tidak aktif
  // Return URL asli, optimasi hanya dari lazy loading
  // TODO: Aktifkan Image Transformation di Supabase Dashboard jika diperlukan
  
  // Jika bukan URL Supabase atau URL lokal, return as is
  if (!url || !url.includes('supabase.co/storage') || url.startsWith('/')) {
    return url;
  }

  // SEMENTARA: Return URL asli tanpa transformasi
  // Karena Supabase Image Transformation mungkin tidak tersedia
  return url;

  /* KODE TRANSFORMASI - UNCOMMENT JIKA SUPABASE IMAGE TRANSFORMATION SUDAH AKTIF
  const {
    width = 400,
    height = null,
    quality = 'medium',
    format = 'webp'
  } = options;

  // Mapping kualitas ke nilai Supabase (0-100)
  const qualityMap = {
    low: 60,
    medium: 75,
    high: 90
  };

  const qualityValue = qualityMap[quality] || 75;

  try {
    // Parse URL untuk mendapatkan path file
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/(.+)/);
    
    if (!pathMatch) {
      return url; // Return original jika format tidak sesuai
    }

    const filePath = pathMatch[1];
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

    // Buat URL dengan transformasi
    // Format: /storage/v1/render/image/public/{bucket}/{path}?width=X&quality=Y
    let transformUrl = `${baseUrl}/storage/v1/render/image/public/${filePath}`;
    
    const params = new URLSearchParams();
    params.append('width', width.toString());
    params.append('quality', qualityValue.toString());
    
    if (height) {
      params.append('height', height.toString());
    }
    
    // Format conversion (Supabase akan otomatis convert ke format yang diminta)
    if (format === 'webp') {
      params.append('format', 'webp');
    }

    const optimizedUrl = `${transformUrl}?${params.toString()}`;
    console.log('Optimized URL:', optimizedUrl);
    return optimizedUrl;
  } catch (error) {
    console.warn('Failed to optimize image URL:', error);
    return url; // Return original URL jika ada error
  }
  */
}

/**
 * Preset untuk card thumbnail
 */
export function getCardThumbnail(url) {
  return optimizeSupabaseImage(url, {
    width: 400,
    height: 300,
    quality: 'medium',
    format: 'webp'
  });
}

/**
 * Preset untuk detail page
 */
export function getDetailImage(url) {
  return optimizeSupabaseImage(url, {
    width: 1200,
    quality: 'high',
    format: 'webp'
  });
}

/**
 * Preset untuk gallery/slider
 */
export function getGalleryImage(url) {
  return optimizeSupabaseImage(url, {
    width: 800,
    quality: 'high',
    format: 'webp'
  });
}
