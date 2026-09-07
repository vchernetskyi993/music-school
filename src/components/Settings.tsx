import { IconSettings } from '@tabler/icons-react';
import { Button, Checkbox, Group, Popover, Select, Stack } from '@mantine/core';
import { Notation, useMutableSettings } from '@/hooks/settings';
import { NoteRoster } from './NoteRoster';

export type SettingsConf = { notation: boolean; intervals?: boolean };

export function Settings({ notation, intervals }: SettingsConf) {
  const [settings, setSettings] = useMutableSettings();
  return (
    <Group justify="center">
      <Popover>
        <Popover.Target>
          <Button size="lg" variant="transparent" leftSection={<IconSettings />}>
            Settings
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <NoteRoster intervals={intervals} />
            <Checkbox
              checked={settings.hint}
              onChange={(e) => setSettings({ ...settings, hint: e.currentTarget.checked })}
              label="Frequency Hint"
            />
            <Checkbox
              checked={settings.counter}
              onChange={(e) => setSettings({ ...settings, counter: e.currentTarget.checked })}
              label="Counter"
            />
            {notation && (
              <Select<Notation>
                label="Notation"
                value={settings.notation}
                data={['SPN', 'Fixed Do']}
                onChange={(value) => setSettings({ ...settings, notation: value! })}
              />
            )}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
