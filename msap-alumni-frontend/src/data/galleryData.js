// '.png' is deliberately excluded — an 18MB raw photo in the New Year album is served from the
// gallery file list instead, and globbing it would bundle it into the site.
const images = import.meta.glob('../assets/Gallary/**/*.{jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

const imageFor = (folder, file) => {
  const relative = `${folder}/${file}`;
  const match = Object.entries(images).find(([key]) => key.includes(relative));
  return match ? match[1] : null;
};

const RAW_ALBUMS = [
  {
    title: '134th Patriots Day',
    folder: '134th patriots day',
    eventDate: '15-Aug-2026',
    updatedOn: '16-Aug-2026',
    files: [
      'SaveClip.App_658239410_18095604002095106_2881931004734362982_n.jpg',
      'SaveClip.App_655139802_18098098589072891_296286572430441289_n.jpg',
      'SaveClip.App_651824569_17927949846075370_2886549829477998910_n.jpg',
    ],
  },
  {
    title: '1st Annual General Body Meeting',
    folder: '1st Annual General Body Meeting',
    eventDate: '07-Jul-2026',
    updatedOn: '2026',
    files: [
      'WhatsApp Image 2026-07-07 at 2.03.58 PM.jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.58 PM (1).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM.jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (1).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (2).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (3).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (5).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (7).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (8).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (9).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (10).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (11).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (12).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (13).jpeg',
      'WhatsApp Image 2026-07-07 at 2.03.59 PM (14).jpeg',
    ],
  },
  {
    title: '1st New Year Get Together',
    folder: '1st New Year Get Together (Sunday, 4th jan, 2026)',
    eventDate: '04-Jan-2026',
    updatedOn: '2026',
    files: [
      '2026 MSAP Alumni New Year Party group.jpeg',
      '2026 MSAP Alumni New Year Party group2.jpeg',
      '2026 MSAP Alumni New Year Party group3 .jpeg',
      '2026 MSAP Alumni New Year Party President.jpeg',
      '2026 MSAP Alumni New Year Party sub group.jpeg',
      '2026 MSAP Alumni New Year Party Tejkumar.jpeg',
      '2026 MSAP Alumni New Year Party Uttam.jpeg',
      '2026 MSAP Alumni New Year Party with Host.jpeg',
      'MSAP Alumni ReUnion 4th Jan 2026 portrait.jpeg',
    ],
  },
  {
    title: '1st Re-Union of Association MSAP Alumni, Manipur',
    folder: '1st Re-Union of Association MSAP Alumni, Manipur at Manipur University Centenary Hall on 11th May, 2025',
    eventDate: '11-May-2025',
    updatedOn: '2025',
    files: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
  },
  {
    title: 'Alumni Working Group Meeting held at Hotel Castle, Imphal',
    folder: 'Alumni Working Group meeting held at Hotel Castle, Imphal on 19th July, 2025',
    eventDate: '19-Jul-2025',
    updatedOn: '2025',
    files: ['1.jpg', '2.jpg'],
  },
  {
    title: '50th Golden Jubilee',
    folder: '50th golden jubilee',
    eventDate: '2024',
    updatedOn: '2024',
    files: [
      'SaveClip.App_655587142_18090688793142807_5674009504128084954_n.jpg',
      'SaveClip.App_654579431_18074631956171937_3498516635108343351_n.jpg',
      'SaveClip.App_656281085_18078739742103184_2897732754253951182_n.jpg',
      'SaveClip.App_655339142_18195899248355114_3168715744275537636_n.jpg',
      'SaveClip.App_656026570_18080244215081494_794976611162626733_n.jpg',
      'SaveClip.App_652681681_17959174805914550_2586455088703413576_n.jpg',
      'SaveClip.App_653101195_17990928932936316_5982040596961041918_n.jpg',
    ],
  },
  {
    title: 'Alumni Working Group Meeting at Joysana Retreat, Oinam',
    folder: 'Alumni Working Group meeting at Joysana Retreat, Oinam on 20th July, 2024',
    eventDate: '20-Jul-2024',
    updatedOn: '2024',
    files: ['1.jpg', '2.jpg'],
  },
  {
    title: '75th Independence Day',
    folder: '75th independence day',
    eventDate: '15-Aug-2021',
    updatedOn: '2021',
    files: [
      'SaveClip.App_623169936_17940065763072885_3399842098326386966_n.jpg',
      'SaveClip.App_623127062_17940065754072885_8837386010981173375_n.jpg',
      'SaveClip.App_623293819_17940065781072885_5331419282334103799_n.jpg',
      'SaveClip.App_623264929_17940065799072885_3470421741983866506_n.jpg',
      'SaveClip.App_623177190_17940065790072885_2146515300879377637_n.jpg',
      'SaveClip.App_623260803_17940065808072885_7749835159516524958_n.jpg',
    ],
  },
  {
    title: 'Freshers Meetup 2025',
    folder: 'freshers meetup 2025',
    eventDate: '2025',
    updatedOn: '2025',
    files: [
      'SaveClip.App_544036378_17926168566072885_3526992923005652048_n.jpg',
      'SaveClip.App_543807325_17926168584072885_7100078052632117039_n.jpg',
      'SaveClip.App_542688547_17926168620072885_5433907270516202808_n.jpg',
      'SaveClip.App_542081340_17926168530072885_8154856757139131985_n.jpg',
    ],
  },
];

const ALBUMS = RAW_ALBUMS.map((album, i) => {
  const photos = album.files
    .map((file) => imageFor(album.folder, file))
    .filter(Boolean);
  return {
    id: i + 1,
    title: album.title,
    eventDate: album.eventDate,
    updatedOn: album.updatedOn,
    photos,
    coverImage: photos[0] || null,
  };
});

export default ALBUMS;