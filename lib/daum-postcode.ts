declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: { address: string; zonecode?: string; buildingName?: string }) => void;
      }) => { open: () => void };
    };
  }
}

export function openPostcode(onComplete: (addr: string) => void) {
  if (typeof window === "undefined" || !window.daum?.Postcode) {
    alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }
  new window.daum.Postcode({
    oncomplete: (data) => {
      const full = data.buildingName
        ? `${data.address} (${data.buildingName})`
        : data.address;
      onComplete(full);
    },
  }).open();
}
