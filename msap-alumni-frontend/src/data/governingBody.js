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
      name: 'Prof. Thokchom Asha Sinha',
      photo: null,
    },
    {
      position: 'Vice President',
      name: 'Col. Shantikumar Sapam, Retd.',
      photo: null,
    },
    {
      position: 'Secretary',
      name: 'Mr Kulabidhu Chanam',
      photo: memberPhoto('Kulabidhu Chanam.jpeg'),
    },
    {
      position: 'Joint Secretary',
      name: 'Ngangom Jotindra Luwang, Adv.',
      photo: memberPhoto('Ngangom Jotindra Luwang.jpeg'),
    },
    {
      position: 'Treasurer',
      name: 'Mr Jhaljit Ningthemcha',
      photo: memberPhoto('Jhaljit Ningthemcha.jpeg'),
    },
  ],
  executiveMembers: [
    { name: 'Mrs Th. Angoubi (Aruna)', photo: memberPhoto('Mrs Th. Angoubi @Aruna Devi.png') },
    { name: 'Dr. A. Bijeshkumar', photo: memberPhoto('Dr A Bijeshkumar.jpeg') },
    { name: 'Sarangthem Suresh Singh, Adv', photo: null },
    { name: 'Mr Jiten Irom', photo: memberPhoto('Irom Jiten.jpeg') },
    { name: 'Mr H. Shantikumar', photo: null },
    { name: 'Mr E. Tomba', photo: null },
  ],
  advisoryBoard: [
    { name: 'Shri Th. Arunkumar, Hon’bl MLA', photo: null },
    { name: 'Dr. H. Narendra', photo: memberPhoto('Dr H Narendra.jpeg') },
    { name: 'Ngongo Chongtham, Sr Adv', photo: memberPhoto('Sr Adv Ch. Ngongo.jpeg') },
    { name: 'Mr. Rajkumar Rakesh', photo: null },
  ],
};