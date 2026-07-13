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
        The photographs on the landing page. Upload as many as you like per section — a section with
        one image shows it still, a section with several fades between them. Images are cropped to
        the frame the page renders them in, so upload the best shot and let it be trimmed.
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
    </>
  );
}
