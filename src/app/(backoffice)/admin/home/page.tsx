import { HOME_SECTIONS, splitAcrossCards } from '@/config/home';
import { getHomeMedia } from '@/server/dal/home';
import HomeMediaManager from './HomeMediaManager';

export const dynamic = 'force-dynamic';

/**
 * Home Models — the landing page's editorial photography.
 *
 * These are brand/model shots, not catalogue items, so they live in their own
 * table rather than as products with invented SKUs. Each section shows however
 * many images it is given: one is a still, several cross-fade.
 */
export default async function AdminHomePage() {
  const media = await getHomeMedia();

  return (
    <>
      <h1 className="adm-h1">Home Models</h1>
      <p className="adm-sub">
        Every photograph on the landing page, including the opening shot. A gallery section takes as
        many images as you like — one shows still, several cross-fade — and each keeps its own shape,
        so nothing is cropped. The two backdrops the page scrolls over (the landing photograph and
        The Editorial) use the first image only, and fill the screen with it.
      </p>

      <div style={{ maxWidth: 760, marginTop: 20 }}>
        {HOME_SECTIONS.map(section => (
          <HomeMediaManager key={section.key} section={section} images={media[section.key]} />
        ))}

        <div className="adm-card">
          <h2 className="adm-h2" style={{ marginBottom: 4 }}>How The Collections deals out its images</h2>
          <p className="adm-sub" style={{ marginBottom: 14 }}>
            That section is three cards, so images are dealt round-robin: 1st → card one,
            2nd → card two, 3rd → card three, 4th → back to card one, and so on. A card holding more
            than one image fades between them.
          </p>
          <div className="adm-table-wrap adm-table-wrap--fit">
          <table className="adm-table">
            <thead><tr><th>Card</th><th>Shows</th></tr></thead>
            <tbody>
              {splitAcrossCards(
                media.collections.map((_, i) => `Image ${i + 1}`), 3,
              ).map((items, card) => (
                <tr key={card}>
                  <td><strong>No. 0{card + 1}</strong></td>
                  <td>{items.length ? items.join(' → ') : 'its original photograph'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </>
  );
}
