const memberPhotos = import.meta.glob('../assets/General Body/*.{jpeg,jpg,png,webp}', {
  eager: true,
  import: 'default',
});

const memberPhoto = (file) => {
  const match = Object.entries(memberPhotos).find(([key]) =>
    key.includes(`General Body/${file}`),
  );
  return match ? match[1] : null;
};

export const governingBody = {
  officeBearers: [
    {
      position: 'President',
      name: 'Prof (Dr) Th. Asha Sinha',
      image: memberPhoto('Prof (Dr) Th. Asha Devi.jpeg'),
    },
    {
      position: 'Vice President',
      name: 'Col. Shantikumar Sapam, Retd.',
      image: memberPhoto('Col Sapam Shantikumar, Retd, VP.jpeg'),
    },
    {
      position: 'Secretary',
      name: 'Mr Kulabidhu Chanam',
      image: memberPhoto('Kulabidhu Chanam.jpeg'),
    },
    {
      position: 'Joint Secretary',
      name: 'Ngangom Jotindra Luwang, Adv.',
      image: memberPhoto('Ngangom Jotindra Luwang.jpeg'),
    },
    {
      position: 'Treasurer',
      name: 'Mr Jhaljit Ningthemcha',
      image: memberPhoto('Jhaljit Ningthemcha.jpeg'),
    },
  ],
  executiveMembers: [
    { name: 'Mrs Th. Angoubi (Aruna)', image: memberPhoto('Mrs Th. Angoubi @Aruna Devi.png') },
    { name: 'Dr. A. Bijeshkumar', image: memberPhoto('Dr A Bijeshkumar.jpeg') },
    { name: 'Sarangthem Suresh Singh, Adv', image: memberPhoto('Adv S Suresh Singh.jpeg') },
    { name: 'Mr Jiten Irom', image: memberPhoto('Irom Jiten.jpeg') },
    { name: 'Mr H. Shantikumar', image: memberPhoto('Hijam Shantikumar.jpeg') },
    { name: 'Mr E. Tomba', image: memberPhoto('E Tomba.jpeg') },
  ],
  advisoryBoard: [
    { name: 'Shri Th. Arunkumar, Hon’bl MLA', image: memberPhoto('Honble MLA Th. Arunkumar.jpeg') },
    { name: 'Dr. H. Narendra', image: memberPhoto('Dr H Narendra.jpeg') },
    { name: 'Ngongo Chongtham, Sr Adv', image: memberPhoto('Sr Adv Ch. Ngongo.jpeg') },
    { name: 'Mr. Rajkumar Rakesh', image: memberPhoto('Rk Rakesh.jpeg') },
  ],
};
