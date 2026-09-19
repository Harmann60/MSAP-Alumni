const BUCKET_ROOT =
  'https://pqfsbbdexjshvqskmbfu.supabase.co/storage/v1/object/public/MSAP%20Photos';

const asset = (folder, file) =>
  `${BUCKET_ROOT}/${[folder, file].map(encodeURIComponent).join('/')}`;

const RAW_ALBUMS = [
  {
    title: '134th Patriots Day',
    folder: '134th Patriots Day',
    eventDate: '15-Aug-2026',
    updatedOn: '16-Aug-2026',
    files: [
      'SaveClip.App_658239410_18095604002095106_2881931004734362982_n.jpg',
      'SaveClip.App_655139802_18098098589072891_296286572430441289_n.jpg',
      'SaveClip.App_651824569_17927949846075370_2886549829477998910_n.jpg',
    ],
  },
  {
    title: '50th Golden Jubilee',
    folder: '50th Golden Jubilee',
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
    title: 'Yaoshang Thabal 2026',
    folder: 'Yaoshang Thabal 2026',
    eventDate: '2026',
    updatedOn: '2026',
    files: [
      'SaveClip.App_649242209_18309006463280704_5308189492314904084_n.jpg',
      'SaveClip.App_649232710_18309006454280704_1648478933012477746_n.jpg',
    ],
  },
  {
    title: '75th Independence Day',
    folder: '75th Independance Day',
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
    folder: 'Freshers Meetup 2025',
    eventDate: '2025',
    updatedOn: '2025',
    files: [
      'SaveClip.App_544036378_17926168566072885_3526992923005652048_n.jpg',
      'SaveClip.App_543807325_17926168584072885_7100078052632117039_n.jpg',
      'SaveClip.App_542688547_17926168620072885_5433907270516202808_n.jpg',
      'SaveClip.App_542081340_17926168530072885_8154856757139131985_n.jpg',
    ],
  },
  {
    title: '1st General Body Meeting',
    folder: '1st General Body Meeting',
    eventDate: '2026',
    updatedOn: '2026',
    files: [
      'SaveClip.App_649242209_18309006463280704_5308189492314904084_n.jpg',
      'SaveClip.App_649232710_18309006454280704_1648478933012477746_n.jpg',
    ],
  },
  {
    title: 'Exhibition Football Match',
    folder: 'Exhibition Football Match',
    eventDate: '—',
    updatedOn: '—',
    files: [
      'SaveClip.App_658387800_18161452207425201_5655032854482152389_n.jpg',
      'SaveClip.App_655225392_18031661516604224_4651380414571975640_n.jpg',
      'SaveClip.App_670946889_18384262783092052_5375768065592297109_n.jpg',
      'SaveClip.App_655008661_18126526930559861_6771118030534233072_n.jpg',
    ],
  },
  {
    title: 'Seasonal Sports Meet 2024',
    folder: 'seasonal sports meet 2024',
    eventDate: '2024',
    updatedOn: '2024',
    files: [
      'SaveClip.App_624082157_18011345444668354_6669835014232952593_n.jpg',
    ],
  },
  {
    title: 'Jananeta Hijam',
    folder: 'Jananeta hijam',
    eventDate: '—',
    updatedOn: '—',
    files: [
      'SaveClip.App_655569347_18084032288365529_1516832685276458567_n.jpg',
      'SaveClip.App_650923498_18042102248753997_8182796091168864797_n.jpg',
      'SaveClip.App_655248329_18156853681445477_1637668967091673004_n.jpg',
    ],
  },
];

const ALBUMS = RAW_ALBUMS.map((album, i) => ({
  id: i + 1,
  title: album.title,
  eventDate: album.eventDate,
  updatedOn: album.updatedOn,
  photos: album.files.map((file) => asset(album.folder, file)),
  coverImage: asset(album.folder, album.files[0]),
}));

export default ALBUMS;