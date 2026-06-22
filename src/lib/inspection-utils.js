export function buildDefaultValues(templateSchema) {
  const defaultValues = {};
  const sections = templateSchema?.sections || [];

  const processField = field => {
    if (field.defaultValue !== undefined && field.defaultValue !== null) {
      defaultValues[field.id] = field.defaultValue;
    }
    if (field.type === 'table' && field.tableConfig?.defaultData) {
      defaultValues[field.id] = field.tableConfig.defaultData;
    }
    if (
      (field.type === 'checkbox' || field.type === 'checklist') &&
      !defaultValues[field.id]
    ) {
      defaultValues[field.id] = [];
    }
  };

  sections.forEach(section => {
    section.groups?.forEach(group => {
      group.fields?.forEach(processField);
      group.sub_groups?.forEach(sub => sub.fields?.forEach(processField));
    });
  });

  return defaultValues;
}

export function buildLabelMap(templateSchema) {
  const map = {};
  const sections = templateSchema?.sections || [];
  sections.forEach(sec => {
    sec.groups?.forEach(grp => {
      grp.fields?.forEach(fld => {
        if (fld.label) map[fld.label] = fld.id;
      });
      grp.sub_groups?.forEach(sub => {
        sub.fields?.forEach(fld => {
          if (fld.label) map[fld.label] = fld.id;
        });
      });
    });
  });
  return map;
}

export function buildInspectionTabs(sections = []) {
  return [
    { id: 'data-umum', label: 'Data Umum', shortLabel: 'Umum' },
    ...sections.map((sec, index) => ({
      id: sec.id || `section-${index}`,
      label: `${index + 1}. ${sec.title}`,
      shortLabel: sec.title,
    })),
    { id: 'dokumentasi', label: 'Dokumentasi Foto', shortLabel: 'Foto' },
    {
      id: 'rekomendasi',
      label: 'Pernyataan & Rekomendasi',
      shortLabel: 'Rekomendasi',
    },
  ];
}

export function collectSectionFields(section) {
  const fields = [];
  section?.groups?.forEach(group => {
    group.fields?.forEach(f => fields.push(f));
    group.sub_groups?.forEach(sub => sub.fields?.forEach(f => fields.push(f)));
  });
  return fields;
}

function isEmptyValue(field, value) {
  if (value === undefined || value === null || value === '') return true;
  if (field.type === 'checkbox' || field.type === 'checklist') {
    return Array.isArray(value) ? value.length === 0 : !value;
  }
  if (field.type === 'table') {
    const rows = Array.isArray(value?.[0]) ? value[0] : value;
    return !Array.isArray(rows) || rows.length === 0;
  }
  return false;
}

export function validateStep({
  activeStep,
  sections,
  values,
  objectInfo,
}) {
  const errors = [];

  if (activeStep === 0) {
    if (!objectInfo?.location?.trim()) {
      errors.push('Lokasi objek wajib diisi.');
    }
    return errors;
  }

  if (activeStep > 0 && activeStep <= sections.length) {
    const section = sections[activeStep - 1];
    const fields = collectSectionFields(section);
    fields.forEach(field => {
      if (!field.required) return;
      if (field.type === 'formula') return;
      if (isEmptyValue(field, values[field.id])) {
        errors.push(`"${field.label}" wajib diisi.`);
      }
    });
  }

  return errors;
}

export function getSubGroupLabel(sub) {
  return sub.sub_group_label || sub.title || sub.group_label || 'Sub Kelompok';
}
