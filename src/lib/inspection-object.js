export function getObjectDisplayInfo(obj) {
  if (!obj) {
    return {
      name: 'Alat',
      subSector: '',
      sectorName: '',
      sectorCode: '',
      location: '',
    };
  }

  const nested = obj.master_object || obj.masterObject;
  const subSectorNested = nested?.sub_sector || nested?.subSector;
  const sectorNested = subSectorNested?.sector;

  return {
    name:
      obj.name ||
      nested?.name ||
      `Alat #${obj.id}`,
    subSector:
      obj.sub_sector ||
      subSectorNested?.name ||
      '',
    sectorName:
      obj.sector_name ||
      sectorNested?.name ||
      '',
    sectorCode:
      obj.sector_code ||
      sectorNested?.code ||
      '',
    location: obj.location || nested?.location || '',
  };
}

export function formatBidangLabel(info) {
  if (info.sectorName && info.sectorCode) {
    return `${info.sectorName} (${info.sectorCode})`;
  }
  return info.sectorName || info.sectorCode || '-';
}
